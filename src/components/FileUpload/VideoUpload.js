import React from 'react'
import PropTypes from 'prop-types'
import { Upload, Button, Icon, message, Row, Col } from 'antd'


class VideoUpload extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            url: '/api/v1/common/video/upload',
            text: props.text ? props.text : '上传视频',
            length: this.props.length ? this.props.length : 3,
            fileList: [],
        }
    }

    handleChange = (info) => {
        let fileList = info.fileList;
        // 1. Limit the number of uploaded files
        // Only to show two recent uploaded files, and old ones will be replaced by the new
        fileList = fileList.slice(-2);

        // 2. Read from response and show file link
        fileList = fileList.map((file) => {
            if (file.response) {
                // Component will show file.url as link
                file.url = file.response.url;
            }
            return file;
        });


        this.setState({ fileList: fileList }, () => { console.log('修改成功') });
        if (info.file.status !== 'uploading') {
        }
        if (info.file.status === 'done') {
            console.log("done")
            console.log(this.props)
            if (this.props.handleSubmit) {
                this.props.handleSubmit(this.props.videoName, info.file.response)
            }
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} 上传失败.`);
        }
    }


    render() {
        const uploadButton = (
            <Button>
                <Icon type="upload" /> {this.state.text}
            </Button>
        )

        const props = {
            action: this.state.url,
            onChange: this.handleChange,
            multiple: false,
        };
        return (
            <Upload {...props} fileList={this.state.fileList}>
                {this.state.fileList.length >= this.state.length ? null : uploadButton}
            </Upload>
        );
    }
}


export default VideoUpload