interface User {
  id?: number;
  name?: string;
  password?: string;
  money?: number;
  hp?: number;
}

interface UserLogin {
  id: number;
  password: string;
}

export { User, UserLogin };
