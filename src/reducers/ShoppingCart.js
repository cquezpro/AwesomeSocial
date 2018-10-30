export default (
  state = {
    chooseSpec: null,
    specSingleSelect: null,
    all_total_price: 0,
    carts: [
        // {
        // shop_id: 5,
        // title: "测试店铺"
        // total_price: 0,
        // data: [
    //    {
    //         id: 5,
    //         unique_id:"1232323",
    //         name: "普通小龙虾",
    //         price: 45,
    //         amount: 3,
    //     },{
    //         id: 6,
    //         unique_id: "asvasvava2",
    //         name: "麻辣香锅",
    //         amount: 1,
    //         price: 5,
    //         specifications:[
    //             {
    //                 id: 61,
    //                 type: "single-choice",
    //                 title: "口味",
    //                 data: [{
    //                     id: 611,
    //                     name:"麻辣",
    //                     price:5,
    //                     amount: 1,
    //                 }]
    //             },
    //             {   id: 62,
    //                 type: "multi-choice",
    //                 min_amount: 2,
    //                 title: "配菜",
    //                 data: [{
    //                     id: 621,
    //                     name:"牛肉",
    //                     price:6,
    //                     amount: 1,
    //                 },{
    //                     id: 622,
    //                     name:"鸡腿",
    //                     price:7,
    //                     amount: 3,
    //                 }]
    //             }
    //         ]
            
    //     }
    //    ]
    //     }
    ],
  },
  action
) => {
    let all_total_price = 0;
    let  carts = [];
  switch (action.type) {
    case "CHOOSE_SPEC":
      let specSingleSelect = {};
      action.payload.specifications.map((v,index)=>{
        if(v.single_select===1){
            let option_ids = [];
            v.data.map((v2,index)=>{
                option_ids.push(v2.id);
            });
            specSingleSelect[v.id] = option_ids;
        }
      });
      return {
        ...state,
        chooseSpec: action.payload,
        specSingleSelect: specSingleSelect
      };
    case "EXIT_CHOOSE_SPEC":
        return {
          ...state,
          chooseSpec: null,
          specSingleSelect: null,
        };
    // case "ADD_TO_CART":
    //   return {
    //     ...state,
    //     carts: state.carts.push(action.payload)
    //   };
    case "ADD_PRODUCT":
        let shop_found = false;
        carts = state.carts.map((val1,index)=>{
            if(val1.shop_id == action.payload.shop_id){
                shop_found = true;
                let total_price = 0;
                let data = [...val1.data,Object.assign({},action.payload.product,{
                    unique_id : '_' + Math.random().toString(36).substr(2, 9)
                })];
                total_price += get_data_price(data);
                all_total_price += total_price;
                return Object.assign({},val1, {
                    data: data,
                    total_price: total_price
                })
            }
            all_total_price += val1.total_price;
            return val1;
        });
        if(!shop_found){
            let data = [Object.assign({},action.payload.product,{
                unique_id : '_' + Math.random().toString(36).substr(2, 9)
            })];
            let total_price = 0;
            total_price += get_data_price(data);
            all_total_price += total_price;
            carts = [...carts,{
                shop_id: action.payload.shop_id,
                title: action.payload.shop_name,
                phone: action.payload.shop_phone,
                location: action.payload.location,
                total_price: total_price,
                data: data}];
        }
        return {
            ...state,
            carts: carts,
            all_total_price: all_total_price,
            chooseSpec: null
        };
    case "REMOVE_0_AMOUNT":
        carts = state.carts.map((val1,index)=>{
            //if(val1.shop_id == action.payload.shop_id){
                let data = val1.data.filter(val2=>
                    val2.amount != 0
                );
                return Object.assign({},val1, {
                    data: data,
                })
            // }
            // return val1;
        });
        carts = carts.filter(val=>
            val.data.length>0
        );
        //console.warn(carts);
        return {
            ...state,
            carts: carts,
        };
    case "CHANGE_PRODUCT_AMOUNT":
        carts = state.carts.map((val1,index)=>{
            if(val1.shop_id == action.payload.shop_id){
                let total_price = 0;
                let data = val1.data.map((val2,index)=>{
                    if(val2.unique_id == action.payload.product_id){
                        return Object.assign({},val2,{
                            amount:(action.payload.isPlus)?(val2.amount+1):((val2.amount>0)?(val2.amount-1):0)
                        })
                    }
                    return val2;
                });
                total_price += get_data_price(data);
                all_total_price += total_price;
                return Object.assign({},val1, {
                    data: data,
                    total_price: total_price
                })
            }
            all_total_price += val1.total_price;
            return val1;
        });
        return {
            ...state,
            carts: carts,
            all_total_price: all_total_price,
        };
    case "CLEAR_CART":
        return {
            ...state,
            carts: [],
            all_total_price: 0,
        };
    default:
      return state;
  }
};

get_data_price = (data) => {
    let total_price = 0;
    data.map((val3,index) => {
        if(val3.specifications.length>0){
            for(let i=0; i<val3.specifications.length; i++){
                for(let j=0; j<val3.specifications[i].data.length; j++){
                    let tmp = val3.specifications[i].data[j];
                    total_price+=tmp.price*tmp.amount*val3.amount;
                }
            }
        }
        total_price+=val3.price*val3.amount;
    });
    return total_price;
}