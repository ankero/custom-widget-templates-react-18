import { useState, useEffect, useRef, Suspense, version } from "react";
import debounce from "lodash.debounce";
import widgetSDK from "@happeo/widget-sdk";
import { WIDGET_SETTINGS } from "./constants";
import { divideDataIntoRows, parseStringJSON } from "./utils";

const AccordionWidget = ({ id, editMode }) => {
  const editRef = useRef();
  const [initialized, setInitialized] = useState(false);
  const [items, setItems] = useState([]);
  const [settings, setSettings] = useState({});
  const [widgetApi, setWidgetApi] = useState();

  console.log("version", version);

  useEffect(() => {
    const doInit = async () => {
      // Init API, use uniqueId for the initialisation as this widget may be present multiple times in a page
      const api = await widgetSDK.api.init(id);

      // After init, declare settings that are displayed to the user, add setSettings as the callback
      api.declareSettings(WIDGET_SETTINGS, setSettings);

      /**
       * Get widget content. This is stringified array
       * We use a pure array to store data since content field is indexed directly
       * and array poses the lease amount of unnecessary data to the index. As an
       * example, if this would be an object, the object keys would be indexed and
       * searchable
       */
      const widgetContent = await api.getContent();
      const parsedContent = parseStringJSON(widgetContent, []);
      const dividedContent = divideDataIntoRows(parsedContent);
      setItems(dividedContent);
      setWidgetApi(api);
      setInitialized(true);

      if (editMode && parsedContent.length === 0) {
        addRow();
      }
    };
    doInit();
  }, [editMode, id]);

  const onItemUpdated = debounce(
    () => {
      const data = [];
      /**
       * Instead of saving this data to state, we just want to loop through the editors.
       * This prevents the editors themselves re-rendering as that causes caret position
       * jumping and loosing of the undo-stack
       */
      editRef.current.querySelectorAll(`.fr-element`).forEach((el) => {
        data.push(el.getContent());
      });
      widgetApi.setContent(JSON.stringify(data));
    },
    200,
    { leading: false, trailing: true },
  );

  const removeRow = (index) => {
    setItems((prevItems) => prevItems.filter((_, i) => i !== index));
  };

  const addRow = () => {
    setItems((prevItems) => [...prevItems, ["", ""]]);
  };

  if (!initialized) {
    // We don't want to show any loaders
    return null;
  }

  return <p>Test</p>;
};

export default AccordionWidget;
