import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CompanySelector from './components/CompanySelector';
import LineChart from './components/LineChart';
import './styles/App.css';
import './styles/LineChart.css';

const App = () => {
    const [companies, setCompanies] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [companyData, setCompanyData] = useState([]);
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoadingMore, setIsLoadingMore] = useState(true);
    const [isChartLoading, setIsChartLoading] = useState(false);

    useEffect(() => {
        fetchCompanies();
    }, []);

    useEffect(() => {
        if (selectedCompany) {
            fetchCompanyData(selectedCompany);
        }
    }, [selectedCompany]);

    const fetchCompanies = async () => {
        try {
            const response = await axios.get(
                'https://quandl10.p.rapidapi.com/datasets.json',
                {
                    headers: {
                        'X-RapidAPI-Key': 'e26f04e1d9msh530670d95c5b04bp10ce37jsn7b36e785a64b',
                        'X-RapidAPI-Host': 'quandl10.p.rapidapi.com'
                    },
                    params: {
                        database_code: 'WIKI',
                        page: currentPage,
                        api_key: 'E3Leqy6VqNTubMNwvADY',
                    },
                }
            );

            const newCompanies = response.data.datasets;

            const sortedCompanies = [...companies, ...newCompanies].sort((a, b) =>
                a.name.localeCompare(b.name)
            );

            setCompanies(sortedCompanies);
            setCurrentPage(currentPage + 1);
            setIsLoadingMore(false);

        } catch (error) {
            setError('Error fetching companies. Please try again later.');
            setIsLoadingMore(false);
            console.error('Error fetching companies:', error);
        }
    };

    const handleLoadMore = async () => {
        setIsLoadingMore(true);
        await fetchCompanies();
        setIsLoadingMore(false);
    };

    // Fetch the list of companies from the Datasets metadata API and set it to state + local storage.
    const fetchCompanyData = async (datasetCode) => {
        try {
            // Caching data to improve performance
            const cachedData = localStorage.getItem(datasetCode);
            if (cachedData) {
                setCompanyData(JSON.parse(cachedData));
            } else {
                const response = await axios.get(
                    `https://quandl10.p.rapidapi.com/datasets/WIKI/${datasetCode}.json`,
                    {
                        headers: {
                            'X-RapidAPI-Key': 'e26f04e1d9msh530670d95c5b04bp10ce37jsn7b36e785a64b',
                            'X-RapidAPI-Host': 'quandl10.p.rapidapi.com'
                        },
                        params: {
                            api_key: 'E3Leqy6VqNTubMNwvADY',
                        },
                    }
                );
                const sortedData = response.data.dataset.data.sort(
                    (a, b) => new Date(a[0]) - new Date(b[0])
                );
                setCompanyData(sortedData);
                try {
                    localStorage.setItem(datasetCode, JSON.stringify(sortedData));
                }
                catch (error) {
                    console.warn('Data is too large to store in localStorage');
                }
            }
            setError('');
            setIsChartLoading(false);

        } catch (error) {
            setError('Error fetching data. Please try again later.');
            setIsChartLoading(false);
            console.error('Error fetching company data:', error);
        }
    };

    const handleCompanyChange = (event) => {
        setSelectedCompany(event.target.value);
        setIsChartLoading(true);
    };

    return (

        <div className="app-container">
            <h1 className="app-title"> 🐮 BULL&BEAR 🐻</h1>
            <header className="app-header">
                <CompanySelector companies={companies} onChange={handleCompanyChange} isLoading={isLoadingMore}/>
                <div className="load-more-button">
                    <button
                        type='button'
                        className='button'
                        onClick={handleLoadMore}
                        disabled={isLoadingMore}>
                        Load More Companies
                    </button>
                </div>
            </header>
            <main className="app-main">
                {(isLoadingMore || isChartLoading) && <div className="spinner"></div>}
                {error ? (
                    <p className="error-message">{error}</p>
                ) : selectedCompany && companyData.length > 0 ? (
                    <LineChart data={companyData}/>
                ) : (
                    <p>Please select a company from the dropdown.</p>
                )}

            </main>
            <footer className="app-footer">
                <p>&copy; {new Date().getFullYear()} 🐮 BULL&BEAR 🐻</p>
            </footer>
        </div>
    );
};

export default App;