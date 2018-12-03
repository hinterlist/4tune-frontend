import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { compose, withProps } from 'recompose';
import { get } from 'lodash';

import TotalAmount from '../../components/stats/TotalAmount';

// Query for games statistics
const STATS_QUERY = gql`
    query Stats {
        stats {
            wagers {
                amount
            }
        }
    }
`;

const withData = graphql(STATS_QUERY, {
    props: ({ data: { stats, loading } }) => ({
        loading,
        stats,
    }),
});

const withAmount = withProps(({ stats }) => ({
    amount: window.web3.fromWei(get(stats, 'wagers.amount', 0), 'ether'),
}));

export default compose(
    withData,
    withAmount,
)(TotalAmount);
