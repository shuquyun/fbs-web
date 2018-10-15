import React from 'react'
import PropTypes from 'prop-types'
import { Upload, Button, Icon, message, Row, Col } from 'antd';

class ImageUpload extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            url: '/api/v1/common/image/upload',
            callback: props.handleSubmit,
            okText: props.okText ? props.okText : '上传图片'
        }

        this.beforeUpload = (file, fileList) => {
            console.log(file)
            const isLt20M = file.size / 1024 / 1024 < 20;
            if (!isLt20M) {
                message.error('文件不能大于 20MB!');
                return false
            }

            if (this.props.type === 2 && (file.type !== 'image/jpeg' && file.type !== 'image/png' && file.type !== 'image/jpeg')) {
                message.error('只能上传JPG、JPEG、PNG格式图片!');
                return false
            } else if (this.props.type === 1 && (file.type !== 'video/mp4')) {
                message.error('只能上传MP4格式视频!');
                return false
            } else if (this.props.type === 3 && (file.type !== 'application/vnd.android.package-archive')) {
                message.error('只能上传APK格式!');
                return false
            }
            return true
        }
    }


    render() {

        const { callback, okText, url, } = this.state
        const props = {
            name: 'image',
            action: url,
            showUploadList: false,
            data: { type: this.props.type || 2, },
            beforeUpload: this.beforeUpload,
            onChange(info) {
                if (info.file.status !== 'uploading') {
                }
                if (info.file.status === 'done') {
                    if (callback) {
                        callback(info.file.response)
                    } else {
                        message.success(`${info.file.name} ${okText} 成功`);
                    }
                } else if (info.file.status === 'error') {
                    message.error(`${info.file.name} 上传失败.`);
                    if (info.file.error.status === 401) {
                        window.location.href = "/login"
                    }
                }
            },
        };


        return (
            <div>
                <Upload {...props}>
                    <Button type="primary" size="large"> <Icon type="upload" /> {okText}</Button>
                </Upload>
            </div>
        );
    }
}

ImageUpload.propTypes = {
    fileList: PropTypes.array,
}

export default ImageUpload
