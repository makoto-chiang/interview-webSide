import { useState, useEffect } from 'react';
import { Divider, Dropdown, Dimmer, Loader } from 'semantic-ui-react';
import ReactECharts from 'echarts-for-react';

import api from '../../services/Api';
import logo from '../../images/logo-dark.svg';
import taipeiLogo from '../../images/taipei-logo.png';

import './Household.scss';

const Household = () =>{
    const [dropDownItem, setDropDownItem] = useState([]);
    const [userSelection, setUserSelection] = useState('');
    const [analysisData, setAnalysisData] = useState([]);

    useEffect(() => {
        const url = process.env.NODE_ENV === 'production'
            ? 'https://shrouded-beach-79423.herokuapp.com/api/household'
            : 'http://localhost:5000/api/household';

        api.get(url)
            .then(res => {
                let finalData = [];
                let dropdownItem = [];
                const rawData = res.data.result.records;
                const taipeiData = rawData.filter(data => data.site_id.indexOf('臺北市') !== -1);

                const uniqueRegionArray = [...new Set(taipeiData.map(data => data.site_id))];

                const sumItem = (type, dataArray) =>{
                    const itemAmountArray = dataArray.map(data => parseInt(data[type]));
                    return itemAmountArray.reduce((acc, curr) => acc + curr);
                }

                uniqueRegionArray.forEach(region =>{
                    const oneRegion = taipeiData.filter(row => row.site_id === region);
        
                    const household_ordinary_m_total = sumItem('household_ordinary_m', oneRegion);
                    const household_ordinary_f_total = sumItem('household_ordinary_f', oneRegion);
                    const household_single_m_total = sumItem('household_single_m', oneRegion);
                    const household_single_f_total = sumItem('household_single_f', oneRegion);

                    finalData.push({ 
                        region, 
                        household_ordinary_m_total, 
                        household_ordinary_f_total, 
                        household_single_m_total, 
                        household_single_f_total 
                    });
                    
                    dropdownItem.push({key: region, text: region.substring(3), value: region});
                });

                setAnalysisData(finalData);
                setDropDownItem(dropdownItem);
            });

    }, []);

    const handleDropDown = data => {
        const regionData = analysisData.filter(list => list.region === data.value).pop();
        setUserSelection(regionData);
    };

    const chartOptions = {
        legend: {},
        tooltip: {},
        grid: {
            containLabel: true
        },
        dataset: {
          source: [
            ['生活型態 vs. 性別', '男', '女'],
            ['共同生活戶', userSelection['household_ordinary_m_total'], userSelection['household_ordinary_f_total']],
            ['獨立生活戶', userSelection['household_single_m_total'], userSelection['household_single_f_total']],
          ]
        },
        xAxis: { type: 'category' },
        yAxis: { 
            name: '戶數', 
            nameTextStyle: {
                fontSize: 10,
                align: 'right',
                padding: [0, 15, 5, 0],
            },
        }, 
        series: [{ type: 'bar' }, { type: 'bar' }]
      };

    return(
        <div id='household'>
            <aside>
                <div>
                    <img src={logo} alt='platform-logo'/>
                </div>
                <div>AWESOME</div>
            </aside>
            <main>
                <div className='top-zone'>
                    <div>
                        <img src={taipeiLogo} alt='taipei-logo'/>
                    </div>
                    <h4>109年人口戶數及性別分佈統計</h4>
                    <div>
                        <span>行政區 :</span>
                        <Dropdown 
                            placeholder='請選擇區域'
                            disabled = {dropDownItem.length === 0 ? true : false}
                            search 
                            selection 
                            options={dropDownItem} 
                            onChange={(_, data)=> handleDropDown(data)}
                        />
                    </div>
                </div>
                <Divider className='divider' />
                <div className='bottom-zone'>
                    {userSelection !== '' 
                        ? <ReactECharts 
                            className='chart'
                            option={chartOptions}
                        />
                        : <div className='no-selection'>請選擇要分析的行政區域</div>
                    } 
                </div>
                <div>
                    <Dimmer className='dimmer' active={analysisData.length !== 0 ? false : true}>
                        <Loader indeterminate>Loading</Loader>
                    </Dimmer>
                </div>
            </main>
        </div>
    );
}

export default Household;