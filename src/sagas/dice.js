import { takeEvery, call, put, take } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import gql from 'graphql-tag';
import { toString } from 'lodash';

import { client } from '../providers/ApolloProvider';
import { DiceContract } from '../contracts';
import { placeBetStart, placeBetSuccess, placeBetFail } from '../actions/dice';
import { setBitsForIndexes } from '../lib/dice';

/**
 * Send a new bet to smart contract
 */
export function* placeBetAsync({ web3, type, payload }) {
    yield put(placeBetStart(payload));

    // Get signature for a new bet
    const mutation = gql`
        mutation signBet($input: SignBetInput!) {
            signBet(input: $input) {
                commit
                commitLastBlock
                signature {
                    r
                    s
                    v
                }
                gasPrice
            }
        }
    `;

    const { data } = yield call(client.mutate, {
        mutation,
        variables: {
            input: { address: web3.account, network: 1 },
        },
    });

    const { commit, commitLastBlock, signature } = data.signBet;

    const diceInstance = yield call(DiceContract.instance);

    try {
        const event = yield call(
            diceInstance.methods.placeBet,
            setBitsForIndexes(payload.dices),
            payload.modulo,
            commitLastBlock,
            commit,
            signature.v,
            signature.r,
            signature.s,
        );

        const channel = eventChannel(emitter => {
            event
                .send({
                    from: web3.account,
                    value: web3.client.utils.toWei(
                        toString(payload.amount),
                        'ether',
                    ),
                })
                .on('transactionHash', hash => emitter(hash))
                .on('error', error => emitter(new Error(error)));

            return () => {};
        });

        const transactionHash = yield take(channel);
        yield put(placeBetSuccess(transactionHash));
    } catch (e) {
        yield put(placeBetFail(e));
    }
}

export function* watchPlaceBetAsync() {
    yield takeEvery('DICE.PLACE_BET_ASYNC', placeBetAsync);
}
