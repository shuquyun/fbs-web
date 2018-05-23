import React from 'react'
import PropTypes from 'prop-types'
import { Tree } from 'antd';
const TreeNode = Tree.TreeNode;


class DataTree extends React.Component {
  state = {
    expandedKeys: this.props.expandedKeys?this.props.expandedKeys:[],
    autoExpandParent: this.props.autoExpandParent?this.props.autoExpandParent:true,
    checkedKeys: this.props.checkedKeys?this.props.checkedKeys:[],
    selectedKeys: this.props.selectedKeys?this.props.selectedKeys:[],
    treeData: this.props.treeData?this.props.treeData:[],
    onCheck: this.props.onCheck,
    onSelect: this.props.onSelect,
  }
  onExpand = (expandedKeys) => {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  }
  onCheckHandle = (object,e) => {
    let checkedKeys = []
    checkedKeys = object.checked

    this.setState({ checkedKeys });
    if(this.state.onCheck){
      this.state.onCheck(checkedKeys)
    }
  }
  onSelectHandle = (selectedKeys, info) => {
    // this.setState({ selectedKeys });
  }
  renderTreeNodes = (data) => {
    return data.map((item) => {
      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.id} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode title={item.title} key={item.id} dataRef={item} />;
    });
  }
  render() {
    return (
      <Tree
        checkable
        showLine
        onExpand={this.onExpand}
        expandedKeys={this.state.expandedKeys}
        autoExpandParent={this.state.autoExpandParent}
        onCheck={this.onCheckHandle}
        checkedKeys={this.state.checkedKeys}
        onSelect={this.onSelectHandle}
        selectedKeys={this.state.selectedKeys}
        defaultExpandAll={true}
        checkStrictly={true}
      >
        {this.renderTreeNodes(this.props.treeData)}
      </Tree>
    );
  }
}

DataTree.propTypes = {

}

export default DataTree
