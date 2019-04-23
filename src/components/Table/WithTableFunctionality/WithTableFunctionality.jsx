import React from 'react';
import { isSearchFilter, getEmptySortingCriteria } from '../../../utils/tableUtils';
import { getReactComponentName } from '../../../utils/componentUtils';

/**
 * Higher order component that allows us to reuse common table stateful logic
 * (pagination, filtering and sorting) between different types of tables.
 */
export default function withTableFunctionality(TableComponent, defaultFilter = {}) {
  return class WithTableFunctionality extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        pageNumber: 0,
        sorting: getEmptySortingCriteria(),
        filter: defaultFilter
      };
    }

    static displayName = `WithTableFunctionality(${getReactComponentName(TableComponent)})`;

    // Load the first page when table is created
    componentDidMount() {
      this.props.loadPage(0, this.state.sorting, this.state.filter);
    }

    render() {
      const { pageNumber, sorting, filter } = this.state;

      return (
        <TableComponent
          pageNumber={pageNumber}
          sorting={sorting}
          filter={filter}

          loadCurrentPage={this.loadCurrentPage}
          onPageChange={this.onPageChange}
          onSortingChange={this.onSortingChange}
          onFilterChange={this.onFilterChange}
          {...this.props}
        />
      );
    }

    loadCurrentPage = () => {
      this.props.loadPage(this.state.pageNumber, this.state.sorting, this.state.filter);
    };

    onPageChange = nextPage => {
      this.setState({ pageNumber: nextPage });
      this.props.loadPage(nextPage, this.state.sorting, this.state.filter);
    };

    onSortingChange = nextSorting => {
      this.setState({ sorting: nextSorting });
      this.props.loadPage(this.state.pageNumber, nextSorting, this.state.filter);
    };

    // prettier-ignore
    onFilterChange = nextFilter => {
      this.setState({ filter: nextFilter, pageNumber: 0 });
      if (isSearchFilter(nextFilter))
        this.props.onSearchQueryChange(nextFilter.valueMatches);
      else
        this.props.loadPage(0, this.state.sorting, nextFilter);
    };
  };
}