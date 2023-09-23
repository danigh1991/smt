import React, { Component } from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import { connect } from "react-redux";
import { Table } from "antd";
import { bindActionCreators } from "redux";
import { setTitle } from "../../../redux/actions";

// API
import UserManagementAPI from "./../../../http/UserManagement";

// Utils
import Page from "../../../utils/Page";
import EditableCell from "../../../utils/EditableCell";

const mapStateToProps = (state) => {
  return {
    language: state.config.language,
    mobile: state.config.mobile,
  };
};

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({ setTitle }, dispatch);

@connect(mapStateToProps, mapDispatchToProps)
class List extends Component {
  constructor(props) {
    super(props);

    const { Share } = this.props.language;

    this.state = {
      permissions: [],
      loading: true,
      pagination: {
        total: null,
        current: 1,
        page: 0,
        pageSize: 20,
        showTotal: (total) => `${Share.paginationShowTotal} (${total})`,
        showSizeChanger: true,
        showQuickJumper: true,
      },
    };
  }

  componentDidMount() {
    const { pagination } = this.state;
    this.props.setTitle("UserManagement.Permission.List.description");
    const params = {
      page: pagination.page,
      size: pagination.pageSize,
    };
    this.getAllPermission(params);
  }

  getAllPermission(params) {
    const { pagination } = this.state;
    this.setState({ loading: true }, () =>
      UserManagementAPI.getAllPermission(params).then((result) => {
        if (result.success) {
          let { content, totalElements, size, number } = result.data;
          let row = number * size;
          content.forEach((value) => {
            value.key = ++row;
          });
          this.setState({
            permissions: content,
            pagination: _.merge(pagination, {
              total: totalElements,
              current: params.page + 1,
            }),
          });
        }
        this.setState({ loading: false });
      })
    );
  }

  handleTableChange = (pagination, filters, sorter) => {
    const params = {
      page: pagination.current - 1,
      size: pagination.pageSize,
      sorter: _.isEmpty(sorter)
        ? null
        : `${sorter.field},${sorter.order.slice(0, -3)}`,
    };
    this.getAllPermission(params);
  };

  onCellChange = (key, dataIndex) => {
    return (value) => {
      const permissions = [...this.state.permissions];
      const target = permissions.find((item) => item.key === key);
      if (target) {
        target[dataIndex] = value;
        this.setState({ permissions });
      }
    };
  };

  render() {
    const { List: language } = this.props.language.UserManagement.Permission;
    const { Share } = this.props.language;
    const isMobile = !!this.props.mobile;
    const { pagination, permissions, loading } = this.state;

    const columns = [
      {
        title: Share.row,
        dataIndex: "key",
        key: "key",
      },
      {
        title: language.name,
        dataIndex: "name",
        key: "name",
        sorter: (a, b) => {
          a.name = a.name === null ? "" : a.name;
          b.name = b.name === null ? "" : b.name;
          return a.name.localeCompare(b.name);
        },
      },
      {
        title: language.caption,
        dataIndex: "caption",
        key: "caption",
        sorter: (a, b) => {
          a.caption = a.caption === null ? "" : a.caption;
          b.caption = b.caption === null ? "" : b.caption;
          return a.caption.localeCompare(b.caption);
        },
        width: "30%",
        render: (text, record) => (
          <EditableCell
            id={record.id}
            field="caption"
            value={text}
            updateCell={UserManagementAPI.editCaptionOfPermission}
            onChange={this.onCellChange(record.key, "caption")}
          />
        ),
      },
    ];
    return (
      <Page
        id={"usermanagement-permission-list"}
        title={language.title}
        description={language.description}
        noCrawl
      >
        <section className="card">
          <div className="card-body">
            <Table
              loading={{
                spinning: loading,
                size: "large",
                tip: Share.loading,
              }}
              className="table-responsive"
              pagination={pagination}
              onChange={this.handleTableChange}
              columns={columns}
              dataSource={permissions}
            />
          </div>
        </section>
      </Page>
    );
  }
}

export default List;

List.propTypes = {
  language: PropTypes.object,
  setTitle: PropTypes.func,
  mobile: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
};
