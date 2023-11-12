/* This component is rendered when there is a client side error, 
ie. Navigating to a route that does not exist.
*/

import { useRouteError } from 'react-router-dom';

export default function ErrorPage() {
  const error = useRouteError();

  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>{String(error)}</p>
    </div>
  );
}
