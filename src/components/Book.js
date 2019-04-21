import React from 'react';
import { List, Avatar, Icon, Card } from 'antd';

const IconText = ({ type, text }) => (
<span>
    <Icon type={type} style={{ marginRight: 8 }} />
    {text}
</span>
);

const Books = (props) => {
    console.log(props.data);
    return (
        <List
            grid={{
                gutter: 16, column: 4
            }}
            pagination={{
            onChange: (page) => {
                console.log(page);
            },
            pageSize: 12,
            }}
            dataSource={props.data}
            
            renderItem={item => (
                <List.Item>
                    <Card
                        hoverable
                        style={{ width: 180 }}
                        cover={<img alt={item.title} src={item.image_url} />}
                    >
                        <Card.Meta
                        title={<a href={'/booklist/'+item.pk}><b>{item.title}</b></a>}
                        />
                    </Card>
                </List.Item>
            )}
        />
    )
}

export default Books;