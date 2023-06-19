export type OnChainCnft = {
  "version": "0.1.0",
  "name": "on_chain_cnft",
  "instructions": [
    {
      "name": "initialize",
      "accounts": [
        {
          "name": "metadata",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "totalMetadataBytes",
          "type": "u32"
        }
      ]
    },
    {
      "name": "update",
      "accounts": [
        {
          "name": "metadata",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "index",
          "type": "u32"
        },
        {
          "name": "bytes",
          "type": "bytes"
        }
      ]
    },
    {
      "name": "log",
      "accounts": [
        {
          "name": "metadata",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "logWrapper",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "start",
          "type": "u32"
        },
        {
          "name": "end",
          "type": "u32"
        },
        {
          "name": "nextTxId",
          "type": {
            "option": "string"
          }
        }
      ]
    },
    {
      "name": "close",
      "accounts": [
        {
          "name": "metadata",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "metadata",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "publicKey"
          }
        ]
      }
    }
  ]
};

export const IDL: OnChainCnft = {
  "version": "0.1.0",
  "name": "on_chain_cnft",
  "instructions": [
    {
      "name": "initialize",
      "accounts": [
        {
          "name": "metadata",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "totalMetadataBytes",
          "type": "u32"
        }
      ]
    },
    {
      "name": "update",
      "accounts": [
        {
          "name": "metadata",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "index",
          "type": "u32"
        },
        {
          "name": "bytes",
          "type": "bytes"
        }
      ]
    },
    {
      "name": "log",
      "accounts": [
        {
          "name": "metadata",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "logWrapper",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "start",
          "type": "u32"
        },
        {
          "name": "end",
          "type": "u32"
        },
        {
          "name": "nextTxId",
          "type": {
            "option": "string"
          }
        }
      ]
    },
    {
      "name": "close",
      "accounts": [
        {
          "name": "metadata",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "metadata",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "publicKey"
          }
        ]
      }
    }
  ]
};
