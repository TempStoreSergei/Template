// actionInfo.ts

export function getActionInfo(url: string | undefined, method: string | undefined): string {
  if (!url || !method) return 'Unknown action';

  let actionDescription = '';

  switch (method.toLowerCase()) {
    case 'post':
      switch (true) {
        case url.includes('/login'):
          actionDescription = 'Login in the system';
          break;
        case url.includes('/products'):
          actionDescription = 'Adding a new product';
          break;
        default:
          actionDescription = `Creating a resource at ${url}`;
          break;
      }
      break;

    case 'put':
      switch (true) {
        case url.includes('/users'):
          actionDescription = 'Updating user information';
          break;
        case url.includes('/products'):
          actionDescription = 'Updating product details';
          break;
        default:
          actionDescription = `Updating a resource at ${url}`;
          break;
      }
      break;

    case 'delete':
      switch (true) {
        case url.includes('/users'):
          actionDescription = 'Deleting a user';
          break;
        case url.includes('/products'):
          actionDescription = 'Removing a product';
          break;
        default:
          actionDescription = `Deleting a resource at ${url}`;
          break;
      }
      break;

    case 'get':
      switch (true) {
        case url.includes('/users'):
          actionDescription = 'Fetching user information';
          break;
        case url.includes('/products'):
          actionDescription = 'Retrieving product details';
          break;
        default:
          actionDescription = `Fetching data from ${url}`;
          break;
      }
      break;

    default:
      actionDescription = `Performing an action at ${url}`;
      break;
  }

  return actionDescription;
}
