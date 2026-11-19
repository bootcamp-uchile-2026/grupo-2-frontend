const entries = [
  {
    name: 'Polera Trip',
    image: 'polera-trip',
    department: 'ropa-y-accesorios',
    category: 'poleras',
    price: 15990,
    rating: 4,
    attributes: ['Reciclado', 'Orgánico'],
  },
  {
    name: 'Quita Manchas',
    image: 'quita-manchas',
    department: 'limpieza-del-hogar',
    category: 'limpiadores',
    price: 7990,
    discount: 10,
    rating: 5,
    attributes: ['Vegano', 'Ingredientes naturales'],
  },
  {
    name: 'Tazón Pez',
    image: 'tazon-pez',
    department: 'decoracion-y-artesania',
    category: 'cerámica',
    price: 9990,
    rating: 4,
    available: false,
    attributes: ['Ingredientes naturales', 'Comercio justo'],
  },
  {
    name: 'Aceite de Jojoba',
    image: 'aceite-de-jojoba',
    department: 'cuidado-personal',
    category: 'aceites',
    price: 10990,
    rating: 5,
    available: false,
    attributes: ['Orgánico', 'Vegano'],
  },
  {
    name: 'Jeans Lorena',
    image: 'jeans-lorena',
    department: 'ropa-y-accesorios',
    category: 'pantalones',
    price: 25990,
    rating: 4,
    available: false,
    attributes: ['Biodegradable', 'Ingredientes naturales'],
  },
  {
    name: 'Miel de Ulmo',
    image: 'miel-de-ulmo',
    department: 'alimentos',
    category: 'miel',
    price: 5990,
    rating: 5,
    available: false,
    attributes: ['Orgánico', 'Comercio justo'],
  },
  {
    name: 'Kit Hortalizas',
    image: 'kit-hortalizas',
    department: 'huerto-y-jardineria',
    category: 'semillas',
    price: 3990,
    rating: 4,
    attributes: ['Orgánico', 'Envase reciclable'],
  },
  {
    name: 'Polerón Montana',
    image: 'montana',
    department: 'ropa-y-accesorios',
    category: 'polerones',
    price: 15594,
    discount: 40,
    rating: 4.5,
    attributes: ['Reciclado', 'Ingredientes naturales'],
    co2Avoided: 1.2,
    greenPoints: 160,
    description:
      'Hermoso polerón bordado, teñido con pigmentos naturales. Ideal para ir al cerro o salidas al aire libre.',
    size: 'XS, S, M, L, XL',
    color: 'Rojo',
    gender: 'Neutro',
  },
];

type HitoProduct = {
  name: string;
  image: string;
  department: string;
  category: string;
  price: number;
  discount?: number;
  rating: number;
  attributes?: string[];
  available?: boolean;
  description?: string;
  size?: string;
  color?: string;
  gender?: string;
  co2Avoided?: number;
  greenPoints?: number;
};

export const hitoProducts: HitoProduct[] = entries;

export const sustainabilityGroups = {
  Ambiental: ['Orgánico', 'Reciclado', 'Biodegradable', 'Compostable'],
  Composición: [
    'Ingredientes naturales',
    'Envase reciclable',
    'Embalaje reducido',
  ],
  'Ético y productivo': [
    'Vegano',
    'Cruelty-Free',
    'Comercio justo',
    'Producción local',
  ],
};

export const hitoAsset = (name: string) => '/img/hito3/' + name;

export const findHitoProduct = (name: string) => hitoProducts.find((product) => product.name === name);
