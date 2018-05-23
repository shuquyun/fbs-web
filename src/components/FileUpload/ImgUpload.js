import React from 'react'
import PropTypes from 'prop-types'
import { Upload, Button, Icon, message,Row,Col } from 'antd';
import axios from 'axios'

class ImgUpload extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      fileList: [],
      multipleFile: props.multipleFile?props.multipleFile:false,
      url: '/api/v1/common/image/upload',
      uploading: false,
      type: props.type?props.type:1,
      callback: props.handleSubmit,
      okText: props.okText?props.okText:'上传'
    }
  }

  handleUpload = () => {
    const { fileList,type,callback } = this.state;
    const formData = new FormData();
    formData.append('type',type)
    fileList.forEach((file) => {
      formData.append('image', file);
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
      message.success("图片上传成功");
      if(callback){
        callback(response.data)
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
        <Row style={{marginBottom:10}}>
          <Col span={6}>
            <Upload {...props}>
              <Button style={{marginTop: '5px'}}>
                <Icon type="upload" /> 选择图片
              </Button>
            </Upload>
          </Col>
          <Col span={6}>
            <Button
              className="upload-demo-start"
              type="primary"
              onClick={this.handleUpload}
              disabled={this.state.fileList.length === 0}
              loading={uploading}
              style={{marginTop: '5px'}}
            >
              {uploading ? `${this.state.okText}中...` : this.state.okText }
            </Button>
          </Col>
        </Row>


      </div>
    );
  }
}

ImgUpload.propTypes = {
  fileList: PropTypes.array,
}

export default ImgUpload
