import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { PersistGate } from "redux-persist/lib/integration/react";
import { persister, store } from "../redux/store";

export default function TemplateProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider store={store}>
      <PersistGate persistor={persister}>
        <BrowserRouter>{children}</BrowserRouter>
      </PersistGate>
    </Provider>
  );
}
