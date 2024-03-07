import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
    const [users, setUsers] = useState([]);
    const [newUser, setNewUser] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: ""
    });
    const [showModal, setShowModal] = useState(false);
    const [editUserId, setEditUserId] = useState(null);
    const [isDataEdited, setIsDataEdited] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = () => {
        fetch('http://localhost:8080/api/users')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setUsers(data.users);
            })
            .catch(error => console.error('Error fetching users:', error));
    };

    const addUser = () => {
        fetch('http://localhost:8080/api/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newUser),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setUsers([...users, data.user]);
                setNewUser({
                    firstName: "",
                    lastName: "",
                    email: "",
                    phone: ""
                });
                setShowModal(false);
            })
            .catch(error => console.error('Error adding user:', error));
    };

    const removeUser = (userId) => {
        fetch(`http://localhost:8080/api/users/${userId}`, {
            method: 'DELETE',
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const updatedUsers = users.filter(user => user.id !== userId);
                setUsers(updatedUsers);
            })
            .catch(error => console.error('Error removing user:', error));
    };

    const openEditModal = (userId) => {
        const userToEdit = users.find(user => user.id === userId);
        setEditUserId(userId);
        setNewUser(userToEdit);
        setShowModal(true);
    };

    const openAddModal = () => {
        setEditUserId(null);
        setNewUser({
            firstName: "",
            lastName: "",
            email: "",
            phone: ""
        });
        setShowModal(true);
        setIsDataEdited(false);
    };


    const updateUser = () => {
        fetch(`http://localhost:8080/api/users/${editUserId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newUser),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                const updatedUsers = users.map(user => {
                    if (user.id === editUserId) {
                        return data.user;
                    }
                    return user;
                });
                setUsers(updatedUsers);
                setNewUser({
                    firstName: "",
                    lastName: "",
                    email: "",
                    phone: ""
                });
                setShowModal(false);
                setEditUserId(null);
                setIsDataEdited(false);
            })
            .catch(error => console.error('Error updating user:', error));
    };

    const handleInputChange = (key, value) => {
        setNewUser({...newUser, [key]: value});
        setIsDataEdited(true);
    };

    return (
        <div className="app-container">
            <h1>Список користувачів</h1>
            <button onClick={openAddModal}>Додати користувача</button>
            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={() => setShowModal(false)}>&times;</span>
                        <h2>{editUserId ? "Редагувати користувача" : "Додати користувача"}</h2>
                        <input
                            type="text"
                            value={newUser.firstName}
                            onChange={(e) => handleInputChange('firstName', e.target.value)}
                            placeholder="Ім'я"
                        />
                        <input
                            type="text"
                            value={newUser.lastName}
                            onChange={(e) => handleInputChange('lastName', e.target.value)}
                            placeholder="Прізвище"
                        />
                        <input
                            type="text"
                            value={newUser.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            placeholder="Email"
                        />
                        <input
                            type="text"
                            value={newUser.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            placeholder="Телефон"
                        />
                        <button disabled={!isDataEdited} onClick={editUserId ? updateUser : addUser}>{editUserId ? "Оновити" : "Зберегти"}</button>
                    </div>
                </div>
            )}
            <table className="user-table">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Ім'я</th>
                    <th>Прізвище</th>
                    <th>Email</th>
                    <th>Номер</th>
                    <th>Редагування користувачів</th>
                </tr>
                </thead>
                <tbody>
                {users.map(user => (
                    <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.firstName}</td>
                        <td>{user.lastName}</td>
                        <td>{user.email}</td>
                        <td>{user.phone}</td>
                        <td>
                            <button onClick={() => openEditModal(user.id)}>Редагувати</button>
                            <button onClick={() => removeUser(user.id)}>Видалити</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default App;
