export function addHateoasLinks(path: string, data: any): any {
  if (!data || typeof data !== 'object') return data;

  const generateLinks = (item: any, type: string) => {
    const id = item._id || item.id;
    const links: any = {};
    if (id) {
      links.self = { href: `/api/${type}/${id}` };
    }

    if (type === 'products' && id) {
      links.collection = { href: `/api/products` };
    } else if (type === 'orders' && id) {
      if (item.userId) {
        links.user = { href: `/api/users/${item.userId}` };
      }
      links.collection = { href: `/api/orders` };
    }
    return links;
  };

  let currentType = '';
  if (path.includes('products')) currentType = 'products';
  if (path.includes('orders')) currentType = 'orders';

  if (!currentType) return data;

  if (Array.isArray(data)) {
    return data.map((item) => ({ ...item, _links: generateLinks(item, currentType) }));
  } else if (data.data && Array.isArray(data.data)) {
    // Handling paginated response wrappers
    return {
      ...data,
      data: data.data.map((item: any) => ({ ...item, _links: generateLinks(item, currentType) })),
      _links: { self: { href: path } },
    };
  } else {
    // Single object response
    return { ...data, _links: generateLinks(data, currentType) };
  }
}
