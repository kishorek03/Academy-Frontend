import React, { useEffect, useState } from 'react';

function ShowPayments() {
    const [payments, setPayments] = useState([]);
    const [userMap, setUserMap] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    const token = localStorage.getItem('authToken');

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const response = await fetch('http://localhost:8080/admin/payments', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error(`Server responded with status ${response.status}`);
                }

                const data = await response.json();
                if (!Array.isArray(data)) {
                    throw new Error("Invalid JSON structure");
                }

                setPayments(data);

                const userIds = [...new Set(data.map(p => p.userId))];
                const userData = await Promise.all(
                    userIds.map(async id => {
                        const res = await fetch(`http://localhost:8080/admin/users/${id}`, {
                            headers: {
                                'Authorization': `Bearer ${token}`
                            }
                        });

                        if (!res.ok) return { id, username: 'Unknown User' };

                        const user = await res.json();
                        return user ? { id, username: user.username } : { id, username: 'Unknown User' };
                    })
                );

                const map = {};
                userData.forEach(user => {
                    map[user.id] = user.username;
                });
                setUserMap(map);

            } catch (err) {
                console.error("Error fetching payments:", err.message);
            }
        };

        fetchPayments();
    }, [token]);

    const filteredPayments = payments.filter(
        p =>
            userMap[p.userId] &&
            userMap[p.userId].toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container">
            <input
                type="text"
                placeholder="Search by Username..."
                className="search-bar"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="scroll-container"></div>
            <table className="payments-table">
                <thead>
                    <tr>
                        <th>S.No</th>
                        <th>Username</th>
                        <th>Amount</th>
                        <th>Currency</th>
                        <th>Status</th>
                        <th>Paid At</th>
                        <th>Order ID</th>
                        <th>Payment ID</th>
                        <th>Signature</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredPayments.map((p, index) => (
                        <tr key={index}>
                            <td>{p.s_No}</td>
                            <td>{userMap[p.userId]}</td>
                            <td>{p.amount}</td>
                            <td>{p.currency}</td>
                            <td className={p.status === 'PAID' ? 'paid' : 'failed'}>{p.status}</td>
                            <td>{new Date(p.paidAt).toLocaleString()}</td>
                            <td>{p.orderId}</td>
                            <td>{p.paymentId}</td>
                            <td>{p.signature}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            

            <style>{`
                .container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    padding: 110px;
                    min-height: 500vh;
                }

                .search-bar {
                    width: 1000px;
                    padding: 10px 15px;
                    margin-bottom: 30px;
                    border: 1px solid #ccc;
                    border-radius: 8px;
                    font-size: 1rem;
                    outline: none;
                    box-shadow: 0 2px 6px rgba(0,0,0,0.1);
                }

                .payments-table {
                    width: 95%;
                    max-width: 1500px;
                    border-collapse: collapse;
                    background: #fff;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                    border-radius: 15px;
                    overflow: hidden;
                }

                .payments-table th, .payments-table td {
                    padding: 18px 14px;
                    text-align: center;
                    border-bottom: 1px solid #eee;
                }

                .payments-table th {
                    background: #2e8b57;
                    color: white;
                    font-weight: 600;
                }

                .payments-table tbody tr:nth-child(even) {
                    background-color: #f9f9f9;
                }

                .payments-table tbody tr:hover {
                    background-color: #d4f0da;
                }
                    
.scroll-container {
  width: 100%;
  max-width: 1100px;
  max-height: 600px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 20px;

  /* Hide scrollbar in Firefox */
  scrollbar-width: none;

  /* Hide scrollbar in IE/Edge */
  -ms-overflow-style: none;
}

/* Hide scrollbar in WebKit browsers */
.scroll-container::-webkit-scrollbar {
  display: none;
}


                .paid {
                    color: green;
                    font-weight: bold;
                }

                .failed {
                    color: red;
                    font-weight: bold;
                }

                @media (max-width: 768px) {
                    .payments-table {
                        font-size: 0.85rem;
                    }
                    .payments-table th, .payments-table td {
                        padding: 10px;
                    }
                    .search-bar {
                        width: 90%;
                    }
                }
            `}</style>
        </div>
    );
}

export default ShowPayments;
