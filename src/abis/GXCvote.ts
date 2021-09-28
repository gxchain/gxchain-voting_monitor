const abi = {
  version: "gxc::abi/1.0",
  types: [],
  structs: [
    {
      name: "users",
      base: "",
      fields: [
        {
          name: "uid",
          type: "uint64",
        },
        {
          name: "approve",
          type: "bool",
        },
      ],
    },
    {
      name: "vote",
      base: "",
      fields: [
        {
          name: "approve",
          type: "bool",
        },
      ],
    },
  ],
  actions: [
    {
      name: "vote",
      type: "vote",
      payable: false,
    },
  ],
  tables: [
    {
      name: "users",
      index_type: "i64",
      key_names: ["uid"],
      key_types: ["uint64"],
      type: "users",
    },
  ],
  error_messages: [],
  abi_extensions: [],
};

export default abi;
