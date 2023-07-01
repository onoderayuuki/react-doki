import React, { useState, useEffect } from 'react';
import './App.css';

const App: React.FC = () => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [iframePaths, setIframePaths] = useState<string[]>([]);

  // APIからデータを取得する関数
  const fetchData = async (selectedOptions: string[]) => {
    try {
      const response = await fetch('http://localhost:4000/urls', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ options: selectedOptions }),
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();
      setIframePaths(data.urls);
      // setIframePaths(["https://storage.googleapis.com/dokis/docs/20230506-B01-01/00_pcd_file.html"]);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;
    if (checked) {
      setSelectedOptions((prevOptions) => [...prevOptions, value]);
    } else {
      setSelectedOptions((prevOptions) =>
        prevOptions.filter((option) => option !== value)
      );
    }
  };

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;
    // setIframePaths(["https://storage.googleapis.com/dokis/docs/20230506-B01-01/00_pcd_file.html"]);
    // セレクトボックスの値に基づいて処理を実行する
  };

  useEffect(() => {
    fetchData(selectedOptions);
  }, [selectedOptions]);

  return (
    <div className="App">
      <header className="App-header">
        <h1>SPA with Iframes</h1>
      </header>
      <div className="content">
        <div className="sidebar">
          <h2>Options</h2>
          <select onChange={handleSelectChange}>
            <option value="">Select an option</option>
            {/* セレクトボックスのオプションを追加 */}
            <option value="option1">Option 1</option>
            <option value="option2">Option 2</option>
            <option value="option3">Option 3</option>
          </select>
          <h2>Checkbox Options</h2>
          <label>
            <input
              type="checkbox"
              value="a"
              onChange={handleCheckboxChange}
            />{' '}
            Option A
          </label>
          <label>
            <input
              type="checkbox"
              value="b"
              onChange={handleCheckboxChange}
            />{' '}
            Option B
          </label>
          <label>
            <input
              type="checkbox"
              value="c"
              onChange={handleCheckboxChange}
            />{' '}
            Option C
          </label>
        </div>
        <div className="main">
          <h2>Iframes</h2>
          {/* 選択されたチェックボックスの数だけiframeを表示 */}
          {iframePaths.map((path) => (
            <div>{path}
              <iframe title={path} key={path} src={path} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
