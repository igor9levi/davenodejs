const usersDB = {
  users: [
    {
      id: 1,
      username: 'davegray',
      name: 'Dave',
      roles: {
        user: 2001,
        admin: 5051,
        editor: 1984,
      },
      lastName: 'Gray',
      password: '$2b$10$K7TXAvlcThWumUKkZjwm3eAyOkO6X4GNkHrmdiQuePail7koQS0Nq', // l
    },
    {
      id: 2,
      username: 'levi9',
      name: 'Levi',
      roles: {
        user: 2001,
      },
      lastName: 'Desni',
      password: '$2b$10$UABOEH./FwTAbbYyu5YlhOOAJk9iuZaZPXsOwAGPpt8Dc3mPdXLyK', // w
    },
  ],
  setUsers: function (data) {
    this.users = data;
  },
};

module.exports = usersDB;
