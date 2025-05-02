import React from 'react';
import './shortlists.module.css';
import Sidebar from '../components/Sidebar';

const ShortlistManager = () => {
  const shortlists = [
    { name: 'Midfield Targets', players: 5, created: '04/25/2024' },
    { name: 'Young Prospects', players: 12, created: '03/18/2024' },
    { name: 'Transfer Window', players: 8, created: '01/10/2024' },
    { name: 'Regional Talent', players: 14, created: '11/22/2023' },
    { name: 'Potential Signings', players: 7, created: '09/05/2023' }
  ];

  return (
    <div className="shortlist-manager-container">
      <aside className="sidebar">
        <Sidebar active="shortlists" />
      </aside>
      <main className="shortlist-content">
        <h1>Shortlist Manager</h1>
        <button className="new-shortlist">NEW SHORTLIST</button>
        <table className="shortlist-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Players</th>
              <th>Date Created</th>
              <th>Manage</th>
            </tr>
          </thead>
          <tbody>
            {shortlists.map((shortlist, index) => (
              <tr key={index}>
                <td>{shortlist.name}</td>
                <td>{shortlist.players}</td>
                <td>{shortlist.created}</td>
                <td><button className="manage-btn">Manage</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
};

export default ShortlistManager;
