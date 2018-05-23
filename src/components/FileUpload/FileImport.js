import React from 'react'
import PropTypes from 'prop-types'
import { Upload, Button, Icon, message } from 'antd';
import axios from 'axios'

class FileUpload extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      fileList: [],
      multipleFile: props.multipleFile?props.multipleFile:false,
      url: props.url,
      uploading: false,
      type: props.type?props.type:1,
      callback: props.handleSubmit,
    }
  }

  handleUpload = () => {
    const { fileList,type,callback } = this.state;
    const formData = new FormData();
    formData.append('type',type)
    fileList.forEach((file) => {
      formData.append('file', file);
    });

    this.setState({
      uploading: true,
    });
    axios.post(this.state.url, formData,{
      headers:{'Content-Type':'multipart/form-data'},
    }).then(response=>{
      this.setState({
        fileList: [],
        uploading: false,
      });
      const successCount = response.data.successCount
      const repeatOrderNoList = response.data.repeatOrderNoList
      let successMessage = `成功导入${successCount}条数据`
      if(repeatOrderNoList&&repeatOrderNoList.length>0){
        successMessage = `${successMessage}, 导入失败${repeatOrderNoList.length}条，失败订单号为：${repeatOrderNoList.join(",")}`
        message.warning(successMessage,6)
      }else{
        message.success(successMessage);
      }

      if(callback){
        callback()
      }
    }).catch((error) => {
      this.setState({
        uploading: false,
      });
      const { response } = error
      let msg
      let statusCode
      if (response && response instanceof Object) {
        const { data, statusText } = response
        statusCode = response.status
        if(statusCode === 401){
          window.location.href = "/login"
        }
        msg = data.message || statusText
      } else {
        statusCode = 600
        msg = error.message || 'Network Error'
      }
      message.error(msg);
    })
  }

  render() {
    const { uploading,url,multipleFile,type } = this.state;
    const props = {
      action: url,
      onRemove: (file) => {
        this.setState(({ fileList }) => {
          const index = fileList.indexOf(file);
          const newFileList = fileList.slice();
          newFileList.splice(index, type);
          return {
            fileList: newFileList,
          };
        });
      },
      beforeUpload: (file) => {
        if(multipleFile){
          this.setState(({ fileList }) => ({
            fileList: [...fileList, file],
          }));
        }else {
          this.setState(({ fileList }) => ({
            fileList: [ file],
          }));
        }
        return false;
      },
      fileList: this.state.fileList,
    };

    return (
      <div>
        <Upload {...props}>
          <Button style={{marginTop: '10px'}}>
            <Icon type="upload" /> 选择文件
          </Button>
        </Upload>
        <Button
          className="upload-demo-start"
          type="primary"
          onClick={this.handleUpload}
          disabled={this.state.fileList.length === 0}
          loading={uploading}
          style={{marginTop: '16px'}}
        >
          {uploading ? '导入中...' : '导入' }
        </Button>
      </div>
    );
  }
}

FileUpload.propTypes = {
  fileList: PropTypes.array,
  url: PropTypes.isRequired
}

export default FileUpload
