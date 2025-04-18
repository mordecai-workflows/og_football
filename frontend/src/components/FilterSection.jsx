import React, { useState } from "react";
import "./FilterSection.css";

const FilterSection = () => {
  const [filters, setFilters] = useState({
    role: "",
    ageRange: "",
    county: "",
    strongFoot: "",
    matchesPlayed: 1,
    height: { min: 105, max: 200 },
  });

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="filter-container">
      <div className="filter-header">
        <div className="filter-title">Sort by</div>
        <div className="reset-section">
          <div className="reset-text">Reset all</div>
        </div>
      </div>

      <div className="filter-content">
        <select
          className="filter-select"
          value={filters.role}
          onChange={(e) => handleFilterChange("role", e.target.value)}
        >
          <option value="">Select Role</option>
          <option value="ST">ST</option>          
          <option value="RW">RW</option>
          <option value="LW">LW</option>
          <option value="CM">CM</option>
          <option value="CDM">CDM</option>
          <option value="CAM">CAM</option>
          <option value="LWB">LWB</option>
          <option value="RWB">RWB</option>
          <option value="LB">LB</option>
          <option value="RB">RB</option>          
          <option value="CB">CB</option>
          <option value="GK">GK</option>
        </select>

        <select
          className="filter-select"
          value={filters.ageRange}
          onChange={(e) => handleFilterChange("ageRange", e.target.value)}
        >
          <option value="">Select age range</option>
          <option value="16-18">16-18</option>
          <option value="19-21">19-21</option>
          <option value="22-25">22-25</option>
          <option value="26+">26+</option>
        </select>

        <select
          className="filter-select"
          value={filters.county}
          onChange={(e) => handleFilterChange("county", e.target.value)}
        >
          <option value="">Select county</option>
          <option value="Mom">Mombasa</option>
          <option value="Kwa">Kwale</option>
          <option value="Kil">Kilifi</option>
          <option value="Trv">Tana River</option>
          <option value="Lamu">Lamu</option>
          <option value="Ttv">Taita-Taveta</option>
          <option value="Gar">Garissa</option>
          <option value="Wjr">Wajir</option>
          <option value="Man">Mandera</option>
          <option value="Mar">Marsabit</option>
          <option value="Isi">Isiolo</option>
          <option value="Mru">Meru</option>
          <option value="Thr">Tharaka-Nithi</option>
          <option value="Emb">Embu</option>
          <option value="Kit">Kitui</option>
          <option value="Mch">Machakos</option>
          <option value="Mak">Makueni</option>
          <option value="Nyn">Nyandarua</option>
          <option value="Nyr">Nyeri</option>
          <option value="Kir">Kirinyaga</option>
          <option value="Mur">Murang'a</option>
          <option value="Kia">Kiambu</option>
          <option value="Tur">Turkana</option>
          <option value="Pkt">West Pokot</option>
          <option value="Sbr">Samburu</option>
          <option value="Trn">Trans Nzoia</option>
          <option value="Uas">Uasin Gishu</option>
          <option value="Ema">Elgeyo-Marakwet</option>
          <option value="Nan">Nandi</option>
          <option value="Bar">Baringo</option>
          <option value="Lai">Laikipia</option>
          <option value="Nkr">Nakuru</option>
          <option value="Nar">Narok</option>
          <option value="Kaj">Kajiado</option>
          <option value="Ker">Kericho</option>
          <option value="Bom">Bomet</option>
          <option value="Kak">Kakamega</option>
          <option value="Vih">Vihiga</option>
          <option value="Bun">Bungoma</option>
          <option value="Bus">Busia</option>
          <option value="Sia">Siaya</option>
          <option value="Ksu">Kisumu</option>
          <option value="Hba">Hom Bay</option>
          <option value="Mig">Migori</option>
          <option value="Ksi">Kisii</option>
          <option value="Nym">Nyamira</option>
          <option value="Nrb">Nairobi</option>
        </select>

        <select
          className="filter-select"
          value={filters.strongFoot}
          onChange={(e) => handleFilterChange("strongFoot", e.target.value)}
        >
          <option value="">Select strong foot</option>
          <option value="left">Left</option>
          <option value="right">Right</option>
          <option value="both">Both</option>
        </select>

      </div>
    </div>
  );
};

export default FilterSection;
