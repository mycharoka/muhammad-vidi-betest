
# APLIKASI CRUD MICROSERVICE

Ini adalah adalah aplikasi microservice CRUD yg dapat melakukan proses registrasi, login, update email, delete user (diri sendiri yg sedang melakukan login) dan mendapatkan data user

Aplikasi ini terbagi menjadi 2 service:
1. `crud-manager`: service ini bertugas sebagai penerima request dari *client* dan melakukan validasi sebelum data yg dikirimkan akan dimasukkan kedalam *Database*. Pada service ini juga terdapat middleware yg membantu dalam validasi data
2. `crud-module`: service ini bertugas sebagai subscriber saat data dikirimkan dari `crud-manager` sebelum akhirnya data tersebut disimpan kedalam *Database* dan response dari proses terebut akan dikembalikan ke *client*
## Authors

- [@muhammadvidi](https://www.github.com/mycharoka)


## Features

- Register New User
- Login
- Get User By User Id
- Get User Profile
- Update User Email
- Delete User
- Caching Data User
- Pub/Sub Using Redis
- Request Body Validation
- JWT Token Authentication


## Installation

Pertama-tama tolong copy `.env.example` menjadi `.env` di setiap direktori

```bash
  cd crud-manager
  cp .env.example .env
```
```bash
  cd crud-module
  cp .env.example .env
```

    
## Deployment

Buat jalanin project ini bisa pake `docker compose`

```bash
  dokcer compose up --build
```


## API Reference

Untuk API bisa import file postman yg terdapat pada aplikasi ini

