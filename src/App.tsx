import React, { useState, useEffect } from 'react';
import './App.css';

const App: React.FC = () => {

  const [dokis, setDokis] = useState<string[]>([]);
  const [selectedDoki, setSelectedDoki] = useState<string>('aaa');
  const [selectedOptions, setSelectedOptions] = useState<string[]>(['00_pcd_file.html','60_mesh.html']);
  const [iframePaths, setIframePaths] = useState<string[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [urls, setUrls] = useState<string>('aaa');// Debug
  const [pngUrls, setPngUrls] = useState<string>('aaa');// Debug

  const initialOptions = ['00_pcd_file.html'
  ,'01_pcd_file_color.html'
  ,'10_clear_noise.html'
  ,'20_plane_nonplane.html'
  ,'31_pcd_scaled.html'
  ,'32_pcd_nonplane_scaled.html'
  ,'41_blue.html'
  ,'42pcd_doki.html'
  ,'43_noise.html'
  ,'44_pcd_doki2.html'
  ,'51_tops.html'
  ,'53_combined_pcd2.html'
  ,'60_mesh.html']; // チェックボックスの選択肢の配列

// APIからデータを取得
  // 土器名一覧
const fetchDokis = async () => {
  try {
    // const api_url = 'http://localhost:4000/list_dokis'
    const api_url = 'https://us-west1-doki-391416.cloudfunctions.net/list_dokis'
    const response = await fetch(api_url);
    if (!response.ok) {
      throw new Error('API request failed');
    }
    const data = await response.json();
    setDokis(data.names);
  } catch (error) {
    console.error(error);
  }
};
  // 断面図一覧
const fetchImageUrls = async () => {
  try {
    const params = new URLSearchParams();
    params.append('doki', selectedDoki);
    const api_url = `https://us-west1-doki-391416.cloudfunctions.net/list_danmens?${params.toString()}`
    // const api_url = `http://localhost:4000/list_danmens?${params.toString()}`;
    setPngUrls(api_url);  // Debug

    const response = await fetch(api_url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('API request failed');
    }
    const data = await response.json();
    setImageUrls(data.urls);
  } catch (error) {
    console.error(error);
  }
};
  // 途中経過の３次元HTML一覧
const fetchData = async (selectedOptions: string[]) => {
  try {
    const params = new URLSearchParams();
    params.append('doki', selectedDoki);
    selectedOptions.forEach((option, index) => {
      params.append(`param${index + 1}`, option);
    });

    const url = `http://localhost:4000/htmls?${params.toString()}`;
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

// 画面操作
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

// フック
  useEffect(() => {
    fetchDokis();
  }, []);

  useEffect(() => {
    fetchImageUrls();
  }, [selectedDoki]);

  useEffect(() => {
    fetchData(selectedOptions);
  }, [selectedOptions, selectedDoki]);


  return (
    <div className="App">
      <header className="App-header">
        <div className="selector">
        <h3>土器を選択 : </h3>
        <select value={selectedDoki} onChange={handleSelectChange}>
        <option value="">None</option>
          {dokis.map((doki, index) => (
            <option key={index} value={doki}>
              {doki}
            </option>
          ))}
        </select>
        </div>
        <h2>Doki*3 + s</h2>
      </header>
      
      <div className="content">
      <div className="main">

        <h3 className="App-header">断面図を選ぶ___{pngUrls}</h3>
        <div className="image-list-container">
          <div className="image-list">
          {imageUrls.length > 0 ? (
            imageUrls.map((imageUrl, index) => (
              <img key={index} src={imageUrl} alt={`Image ${index}`} />
            ))
          ) : (
            <p>No images found.</p>
          )}
          </div>
        </div>

        <h3 className="App-header">過程を確認する_____ {urls}</h3>
        <div className="iframe-list-container">
          <div className="iframe-list">
            {iframePaths.map((path) => (            
              <iframe title={path} key={path} src={path} />              
            ))}
          </div>
          <div className="sidebar">
            {initialOptions.map((option) => (
              <label key={option}>
                <input
                  type="checkbox"
                  value={option}
                  checked={selectedOptions.includes(option)}
                  onChange={handleCheckboxChange}
                />
                {option}
              </label>
            ))}
            </div>
        </div>

      </div>
      </div>

    </div>
  );
};

export default App;
