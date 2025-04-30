import Sidebar from "../components/Sidebar";
import styles from "./progress.module.css";

const weeks = [
  { week: "Week 1", searches: 10 },
  { week: "Week 2", searches: 8 },
  { week: "Week 3", searches: 15 },
  { week: "Week 4", searches: 12 },
];

export default function ProgressAnalytics() {
  return (
    <div className={styles.container}>
      <Sidebar active="progress" />
      <main className={styles.main}>
        <h1 className={styles.title}>Progress Analytics</h1>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Video Views Over Time</h2>
          <div className={styles.graphBox}>
            {/* Simple SVG Line Chart */}
            <svg viewBox="0 0 350 120" className={styles.lineChart}>
              <rect x="0" y="0" width="350" height="120" fill="#f8fafc" />
              <polyline
                fill="none"
                stroke="#2563eb"
                strokeWidth="3"
                points="0,100 35,90 70,60 105,80 140,90 175,100 210,80 245,60 280,90 315,80"
              />
              {/* Dots */}
              {[100, 90, 60, 80, 90, 100, 80, 60, 90, 80].map((y, i) => (
                <circle key={i} cx={i * 35} cy={y} r="4" fill="#2563eb" />
              ))}
              {/* Y Axis Labels */}
              <text x="0" y="115" fontSize="12" fill="#888">
                1
              </text>
              <text x="35" y="115" fontSize="12" fill="#888">
                2
              </text>
              <text x="70" y="115" fontSize="12" fill="#888">
                3
              </text>
              <text x="105" y="115" fontSize="12" fill="#888">
                4
              </text>
              <text x="140" y="115" fontSize="12" fill="#888">
                5
              </text>
              <text x="175" y="115" fontSize="12" fill="#888">
                6
              </text>
              <text x="210" y="115" fontSize="12" fill="#888">
                7
              </text>
              <text x="245" y="115" fontSize="12" fill="#888">
                8
              </text>
              <text x="280" y="115" fontSize="12" fill="#888">
                9
              </text>
              <text x="315" y="115" fontSize="12" fill="#888">
                10
              </text>
              {/* Y axis grid lines */}
              <line
                x1="0"
                y1="20"
                x2="350"
                y2="20"
                stroke="#e5e7eb"
                strokeDasharray="4"
              />
              <line
                x1="0"
                y1="60"
                x2="350"
                y2="60"
                stroke="#e5e7eb"
                strokeDasharray="4"
              />
              <line
                x1="0"
                y1="100"
                x2="350"
                y2="100"
                stroke="#e5e7eb"
                strokeDasharray="4"
              />
            </svg>
          </div>
        </div>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Coach Endorsements Per Video</h2>
          <div className={styles.graphBox}>
            {/* Simple SVG Bar Chart */}
            <svg viewBox="0 0 350 80" className={styles.barChart}>
              <rect x="0" y="0" width="350" height="80" fill="#f8fafc" />
              {/* Bars */}
              <rect
                x="20"
                y="40"
                width="18"
                height="30"
                fill="#38bdf8"
                rx="4"
              />
              <rect
                x="60"
                y="30"
                width="18"
                height="40"
                fill="#2563eb"
                rx="4"
              />
              <rect
                x="100"
                y="35"
                width="18"
                height="35"
                fill="#38bdf8"
                rx="4"
              />
              <rect
                x="140"
                y="25"
                width="18"
                height="45"
                fill="#2563eb"
                rx="4"
              />
              <rect
                x="180"
                y="40"
                width="18"
                height="30"
                fill="#38bdf8"
                rx="4"
              />
              <rect
                x="220"
                y="30"
                width="18"
                height="40"
                fill="#2563eb"
                rx="4"
              />
              <rect
                x="260"
                y="35"
                width="18"
                height="35"
                fill="#38bdf8"
                rx="4"
              />
              <rect
                x="300"
                y="25"
                width="18"
                height="45"
                fill="#2563eb"
                rx="4"
              />
            </svg>
          </div>
        </div>
        <div className={styles.section}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Week</th>
                <th>Appeared in X scout searches</th>
              </tr>
            </thead>
            <tbody>
              {weeks.map((row, idx) => (
                <tr key={idx}>
                  <td>{row.week}</td>
                  <td>{row.searches}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
