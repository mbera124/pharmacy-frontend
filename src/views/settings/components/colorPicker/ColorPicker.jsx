import { Modal, Button } from 'antd';
import React, { useEffect, useState } from 'react';
import { SketchPicker } from 'react-color';

const ColorPicker = () => {
  const [visible, setVisible] = useState(false);
  const [color, setColor] = useState(
    localStorage.getItem('siderColor') || '#200637'
  );

  const handleColorChange = (value) => {
    const newColor = value.hex;
    setColor(newColor);
    localStorage.setItem('siderColor', newColor);
    location.reload();
  };

  const handleOk = (value) => {
    setVisible(false);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const showColorPicker = () => {
    setVisible(true);
  };

  return (
    <>
      <Modal
        title='Select a color'
        open={visible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <SketchPicker color={color} onChange={(e) => handleColorChange(e)} />
      </Modal>
      <Button onClick={showColorPicker}>Select a color</Button>
    </>
  );
};

export default ColorPicker;
