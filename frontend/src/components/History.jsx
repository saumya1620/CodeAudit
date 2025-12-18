// 

import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import jsPDF from "jspdf";

const History = ({ openEditor , openNewEditor}) => {
  const { token } = useContext(AuthContext);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (!token) return;

    fetch("http://localhost:5000/api/review", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setHistory(data))
      .catch((err) => console.error(err));
  }, [token]);

  // Function to download PDF for a review
  const downloadPDF = (item) => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text(`Language: ${item.language}`, 10, 20);

    doc.setFontSize(14);
    doc.text("Code:", 10, 30);

    doc.setFontSize(12);
    const codeLines = item.code.split("\n");
    let y = 40;
    codeLines.forEach((line) => {
      doc.text(line, 10, y);
      y += 7; // line spacing
    });

    y += 5;
    doc.setFontSize(14);
    doc.text("Review:", 10, y);
    y += 10;

    doc.setFontSize(12);
    const reviewLines = item.review.split("\n");
    reviewLines.forEach((line) => {
      if (y > 280) { // create new page if too long
        doc.addPage();
        y = 20;
      }
      doc.text(line, 10, y);
      y += 7;
    });

    doc.save(`${item.language}_review.pdf`);
  };

  return (
    <div className="p-6 text-white">
      <h2 className="text-xl font-bold mb-4">Review History</h2>
        <button
          onClick={openNewEditor}
          className="bg-green-600 px-4 py-2 rounded"
        >
          New Editor
        </button>

      {history.map((item) => (
        <div
          key={item._id}
          className="bg-zinc-900 p-4 rounded mb-3 flex justify-between items-center"
        >
          <div>
            <p className="font-semibold">{item.language}</p>
            <p className="text-sm text-gray-400">
              {new Date(item.createdAt).toLocaleString()}
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => openEditor(item)}
              className="bg-purple-600 px-4 py-1 rounded"
            >
              See Code
            </button>

            <button
              onClick={() => downloadPDF(item)}
              className="bg-green-600 px-4 py-1 rounded"
            >
              Download PDF
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default History;
