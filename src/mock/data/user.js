import Mock from 'mockjs';
const LoginUsers = [
  {
    id: 1,
    username: 'admin',
    password: '123456',
    avatar: 'https://raw.githubusercontent.com/Thranduils/markdown-images/master/vueadmin/user.png',
    name: '用户名'
  }
];

const Users = [];

for (let i = 0; i < 96; i++) {
  Users.push(Mock.mock({
      id: Mock.Random.guid(),
      name2: Mock.Random.province(),
      category: Mock.Random.integer(0, 1),
      'score|1-5.1': 1,
      sincerity: Mock.Random.integer(0, 1),
      hotspot: Mock.Random.integer(0, 1),
      top: Mock.Random.integer(0, 1),
      ticket: Mock.Random.integer(0, 1)
  }));
}

export { LoginUsers, Users };
