import React, { useState, useEffect } from 'react';
import './App.css';

const App: React.FC = () => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [selectedDoki, setSelectedDoki] = useState<string>('aaa');
  const [iframePaths, setIframePaths] = useState<string[]>([]);
  const [urls, setUrls] = useState<string>('aaa');

// APIからデータを取得する関数
const fetchData = async (selectedOptions: string[]) => {
  try {
    const params = new URLSearchParams();
    params.append('doki', selectedDoki);
    selectedOptions.forEach((option, index) => {
      params.append(`param${index + 1}`, option);
    });

    // const url = `http://localhost:4000/urls?${params.toString()}`;
    const url = `http://localhost:4000/urls`;
    setUrls(url);  // Debug
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('API request failed');
    }

    const data = await response.json();
    setIframePaths(data.urls);
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
    setSelectedDoki(value);
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
          <h5>{urls}</h5>
        </div>
        <div className="main">
          
          {/* 選択されたチェックボックスの数だけiframeを表示 */}
          {iframePaths.map((path) => (            
              <iframe title={path} key={path} src={path} />              
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
