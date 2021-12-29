import { Button, DatePicker, Form, Input, Modal } from 'antd';
import { Moment } from 'moment';
import { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../apis';

interface DigestFormValues {
  title: string;
  description?: string;
  range: [Moment, Moment];
}

const DigestForm: FC = () => {
  const [isLoading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = async (values: DigestFormValues) => {
    try {
      setLoading(true);
      const { data } = await api.digest.create({
        title: values.title,
        description: values.description,
        from: values.range[0].toDate(),
        to: values.range[1].toDate(),
      });
      form.resetFields();
      Modal.confirm({
        title: '성공',
        onOk: () => {
          navigate(`/digest/${data.id}`);
        },
        okText: '이동',
        cancelText: '닫기',
      });
    } catch (e: any) {
      console.log(e);
      Modal.error({
        title: '실패',
        content: e.toString(),
      });
    }
    setLoading(false);
  };

  return (
    <Form
      form={form}
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 12 }}
      initialValues={{ remember: true }}
      onFinish={onFinish}
      autoComplete="off"
    >
      <Form.Item label="제목" name="title" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item label="설명" name="description">
        <Input.TextArea />
      </Form.Item>
      <Form.Item label="범위" name="range" rules={[{ required: true }]}>
        <DatePicker.RangePicker showTime format="YYYY-MM-DD HH:mm:ss" />
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 6, span: 12 }}>
        <Button type="default" htmlType="submit" loading={isLoading}>
          만들기
        </Button>
      </Form.Item>
    </Form>
  );
};

export default DigestForm;
