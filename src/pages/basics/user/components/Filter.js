/* global document */
import React from "react";
import PropTypes from "prop-types";
import { Form, Button, Row, Col, DatePicker, Input } from "antd";

const ColProps = {
    xs: 24,
    sm: 12,
    style: {
        marginBottom: 16
    }
};

const TwoColProps = {
    ...ColProps,
    xl: 96
};

const Filter = ({
    onAdd,
    form: { getFieldDecorator, getFieldsValue, setFieldsValue }
}) => {
    return (
        <Row gutter={24}>
            <Col
                {...TwoColProps}
                xl={{ span: 10 }}
                md={{ span: 24 }}
                sm={{ span: 24 }}
            >
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        flexWrap: "wrap"
                    }}
                >
                    <div className="flex-vertical-center">
                        <Button type="ghost" onClick={onAdd}>
                            添加用户
                        </Button>
                    </div>
                </div>
            </Col>
        </Row>
    );
};

Filter.propTypes = {
    onAdd: PropTypes.func,
    form: PropTypes.object,
};

export default Form.create()(Filter);
