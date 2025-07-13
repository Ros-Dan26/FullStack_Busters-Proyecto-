const productos = [
    {
        producto: "Camiseta Toluca FC",
        precio: 20.00,
        precioOferta: 15.00,
        tallas: ["S", "M", "L", "XL"],
        imagen: "https://www.newbalancemexico.com/on/demandware.static/-/Sites-MX_catalog_master_sfcc/es_MX/v1750875430451/images/mt832107hme_nb_0.png?wid=880&hei=880",
        descripcion: "Camiseta deportiva del actual campeón del futbol mexicano. Ideal para mostrar tu apoyo al equipo y lucir un estilo moderno y deportivo. ¡No te quedes sin la tuya!"
    },
    {
        producto: "Pantalon Deportivo Escencial",
        precio: 35.00,
        precioOferta: 30.00,
        tallas: ["S", "M", "L", "XL"],
        imagen: "https://nb.scene7.com/is/image/NB/mp43551bk_nb_70_i?wid=880&hei=880",
        descripcion: "Descubre estos pantalones casuales color all black New Balance para hombre, son un básico versátil para el día a día que se adapta a tu estilo de vida activo y moderno. ¡No te quedes sin los tuyos y cómpralos ya!."
    },
    {
        producto: "Nike Metcon 1 OG",
        precio: 50.00,
        precioOferta: 45.00,
        tallas: ["24", "25", "26", "27", "28", "29", "30"],
        imagen: "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/0497151c-ea67-46c5-a3ac-35fa977d11d1/NIKE+METCON+1+OG.png",
        descripcion: "Los Metcon 1 regresaron con un diseño realmente minimalista."
    },
    {
        producto: "Nike Air Max 270",
        precio: 120.00,
        precioOferta: 100.00,
        tallas: ["24", "25", "26", "27", "28", "29", "30"],
        imagen: "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/86d674b1-9f36-40bc-90c2-2e817025242c/NIKE+AIR+MAX+PLUS+G.png",
        descripcion: "Las Nike Air Max 270 combinan estilo y comodidad con una gran unidad Air en el talón."
    },
    {
        producto: "Adidas Ultraboost 21",
        precio: 180.00,
        precioOferta: 160.00,
        tallas: ["24", "25", "26", "27", "28", "29", "30"],
        imagen: "https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/7210d2419d5a448f9526ac7f0116f93f_9366/Tenis_Ultraboost_21_Negro_FZ2762_01_standard.jpg",
        descripcion: "Las Adidas Ultraboost 21 ofrecen una pisada suave y reactiva, perfectas para correr largas distancias."
    },
    {
        producto: "Puma RS-X",
        precio: 110.00,
        precioOferta: 95.00,
        tallas: ["24", "25", "26", "27", "28", "29", "30"],
        imagen: "https://images.puma.net/images/308634/02/fnd/MEX/w/600/h/600/fmt/png/bg/%23FAFAFA",
        descripcion: "Los Puma RS-X son una declaración de estilo con su diseño retro y comodidad excepcional."
    },
    {
        producto: "NikeDrift T-Shirt",
        precio: 25.00,
        precioOferta: 15.00,
        tallas: ["S", "M", "L", "XL"],
        imagen: "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/70c5dbb1-4439-401c-82fa-d56def4d0270/M+NK+DF+TEE+RLGD+RESET.png",
        descripcion: "Como actualización de la playera Legend, esta playera absorbente de sudor es suave en todas las formas correctas. También la recortamos con un ajuste más relajado y holgado que las versiones anteriores para que puedas lograr todas tus repeticiones sin perder el ritmo."     
    },
    {
        producto: "Adidas Essentials 3-Stripes",
        precio: 30.00,
        precioOferta: 25.00,
        tallas: ["S", "M", "L", "XL"],
        imagen: "https://m.media-amazon.com/images/I/513N8hob4IL.__AC_SY300_SX300_QL70_ML2_.jpg",
        descripcion: "La camiseta Essentials 3-Stripes de Adidas es un clásico atemporal con un toque moderno."
    },
    {
        producto: "Under Armour Tech 2.0",
        precio: 28.00,
        precioOferta: 22.00,
        tallas: ["S", "M", "L", "XL"],
        imagen: "https://http2.mlstatic.com/D_NQ_NP_998620-MLM46571897400_062021-O-playera-under-armour-tech-20-manga-corta-para-hombre.webp",
        descripcion: "La camiseta Under Armour Tech 2.0 es perfecta para entrenar, con tecnología que absorbe el sudor y te mantiene fresco."
    },
    {
        producto: "Reebok Workout Ready",
        precio: 32.00,
        precioOferta: 28.00,
        tallas: ["S", "M", "L", "XL"],
        imagen: "https://m.media-amazon.com/images/I/61Xw+UAR82L._AC_SY606_.jpg",
        descripcion: "La camiseta Workout Ready de Reebok es ideal para tus entrenamientos, con un diseño cómodo y funcional."
    },
    {
        producto: "Nike Totality",
        precio: 60.00,
        precioOferta: 55.00,
        tallas: ["S", "M", "L", "XL"],
        imagen: "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/06f55d66-c1fd-4bb3-a416-f31564ad7bd8/M+NK+DF+TOTALITY+KNIT+7IN+UL.png",
        descripcion: "Diseñados para el entrenamiento, nuestros shorts Totality absorbentes de sudor te permiten mantener la simplicidad y la frescura."
    },
]