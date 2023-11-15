// import { FabricJSEditor } from "./editor"

// interface IShadowCanvas {
//   editor: FabricJSEditor;
//   optional?: () => void;
//   overwrite?: boolean;
//   doLater?: () => void;
// }
// const ShadowCanvas = ({ editor, optional, overwrite = false, doLater }: IShadowCanvas) => {
//   const click = () => {
//     if (overwrite && optional) {
//       optional()
//     } else {
//       switch (selectedTool) {
//         case "CIRCLE":
//           editor?.addCircle({ left: x - 80, top: y - 160, width: 80, height: 80, radius: 80, angle: 0 }, { type: "CIRCLE", id });
//           dispatch(addList({ color: editor?.fillColor, id }))
//           break;
//         case "CIRCLE_WHITE":
//           editor?.addCircle({ left: x - 80, top: y - 90, width: 80, height: 80, radius: 80, angle: 0, fill: "#fff" }, { type: "CIRCLE_WHITE", id });
//           dispatch(addList({ color: editor?.fillColor, id }))

//           break;
//         case "RECT":
//           editor?.addRectangle({ left: x - 40, top: y - 90, width: 80, height: 80, angle: 0 }, { type: "RECTANGLE", id });
//           dispatch(addList({ color: editor?.fillColor, id }))
//           break;
//         case "TRIANGLE":
//           editor?.addTriangle({ left: x - 40, top: y - 90, width: 80, height: 80, angle: 0 }, { type: "TRIANGLE", id });
//           dispatch(addList({ color: editor?.fillColor, id }))
//           break;
//         default:
//           break;
//       }
//     }
//   }
//   return (
//     <div>

//     </div>
//   )
// }

// export default ShadowCanvas