import React from 'react';
import '../styles/CompanySelector.css';

const CompanySelector = ({ companies, onChange, isLoading }) => {
    return (
        <div className="company-selector-container">
            <select className="company-selector" onChange={onChange} disabled={isLoading}>
                <option value="">Select a company</option> {/* Empty initial option */}
                {companies.map((company) => (
                    <option key={company.dataset_code} value={company.dataset_code}>
                        {company.name}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default CompanySelector;