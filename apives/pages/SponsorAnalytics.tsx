import { useEffect, useState } from "react";

export default function SponsorAnalytics() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://apives.onrender.com/api/sponsor/stats")
      .then(res => res.json())
      .then(json => {
        setData(json);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading sponsor analytics...</div>;

  return (
    <div style={{ padding: 20 }}>
      <h1>Sponsor Analytics</h1>

      <table border={1} cellPadding={10}>
        <thead>
          <tr>
            <th>Sponsor</th>
            <th>Impressions</th>
            <th>Clicks</th>
            <th>CTR (%)</th>
          </tr>
        </thead>
        <tbody>
          {data.map((s) => (
            <tr key={s.sponsor}>
              <td>{s.sponsor}</td>
              <td>{s.impressions}</td>
              <td>{s.clicks}</td>
              <td>{s.ctr}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}