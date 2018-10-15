/* global document */
import React from "react";
import PropTypes from "prop-types";
import moment from "moment";
import { FilterItem } from "components";
import { Form, Button, Row, Col } from "antd";

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

const Filter = ({ onAdd }) => {
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
                            新建
                        </Button>
                    </div>
                </div>
            </Col>
        </Row>
    );
};

Filter.propTypes = {
    onAdd: PropTypes.func
};

export default Form.create()(Filter);
