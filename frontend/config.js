window.MYJLPT_CONFIG = {
  REGION: "us-east-1",
  USER_POOL_ID: "us-east-1_qNGkjJxCw",
  CLIENT_ID: "cep59n0bor5645d07fvvn0c05",

  API: {
    // 使用者資料（/me）
    USER: "https://9wos2vdj65.execute-api.us-east-1.amazonaws.com",

    // 登入 / 註冊
    AUTH: "https://h9xjivtbvb.execute-api.us-east-1.amazonaws.com/pord",

    // 管理後台（如果有）
    ADMIN: "https://6vinzc9dng.execute-api.us-east-1.amazonaws.com"
  }
};

Object.freeze(window.MYJLPT_CONFIG);
Object.freeze(window.MYJLPT_CONFIG.API);