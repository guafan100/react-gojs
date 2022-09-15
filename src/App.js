// App.js
import React from 'react';

import * as go from 'gojs';
import { ReactDiagram } from 'gojs-react';
import './style.css';

/**
 * Diagram initialization method, which is passed to the ReactDiagram component.
 * This method is responsible for making the diagram and initializing the model and any templates.
 * The model's data should not be set here, as the ReactDiagram component handles that via the other props.
 */
function initDiagram() {
  const $ = go.GraphObject.make;
  // set your license key here before creating the diagram: go.Diagram.licenseKey = "...";
  const diagram = $(go.Diagram, {
    'undoManager.isEnabled': true, // must be set to allow for model change listening
    // 'undoManager.maxHistoryLength': 0,  // uncomment disable undo/redo functionality
    'clickCreatingTool.archetypeNodeData': {
      text: 'new node',
      color: 'lightblue',
    },
    model: new go.GraphLinksModel({
      linkKeyProperty: 'key', // IMPORTANT! must be defined for merges and data sync when using GraphLinksModel
    }),
  });

  function nodeInfo(d) {
    // Tooltip info for a node data object
    var str = 'Node ' + d.key + ': ' + d.text + '\n';
    if (d.group) str += 'member of ' + d.group;
    else str += 'top-level node';
    return str;
  }

  const commonContextMenu = $(
    'ContextMenu',
    $('ContextMenuButton', $(go.TextBlock, 'Copy Full Path'), {
      click: (_e, obj) => {
        var contextmenu = obj.part; // the Button is in the context menu Adornment
        var part = contextmenu.adornedPart; // the adornedPart is the Part that the context menu adorns
        // now can do something with PART, or with its data, or with the Adornment (the context menu)
        if (part instanceof go.Link) alert(linkInfo(part.data));
        else if (part instanceof go.Group) alert(groupInfo(contextmenu));
        else console.log(part.data);
      },
    })
  );

  // define a simple Node template
  diagram.nodeTemplate = $(
    go.Node,
    'Auto', // the Shape will go around the TextBlock
    new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(
      go.Point.stringify
    ),
    $(
      go.Shape,
      'RoundedRectangle',
      { name: 'SHAPE', fill: 'white', strokeWidth: 0 },
      // Shape.fill is bound to Node.data.color
      new go.Binding('fill', 'color')
    ),
    $(
      go.TextBlock,
      { margin: 8, editable: true }, // some room around the text
      new go.Binding('text').makeTwoWay()
    ),
    {
      contextMenu: commonContextMenu,
    }
  );

  return diagram;
}
export default function App() {
  return (
    <div style={{ height: 500 }}>
      <ReactDiagram
        initDiagram={initDiagram}
        divClassName="diagram-component"
        nodeDataArray={[
          { key: 0, text: 'Alpha', color: 'lightblue', loc: '0 0' },
          { key: 1, text: 'Beta', color: 'orange', loc: '150 0' },
          { key: 2, text: 'Gamma', color: 'lightgreen', loc: '0 150' },
          { key: 3, text: 'Delta', color: 'pink', loc: '150 150' },
        ]}
        linkDataArray={[
          { key: -1, from: 0, to: 1 },
          { key: -2, from: 0, to: 2 },
          { key: -3, from: 1, to: 1 },
          { key: -4, from: 2, to: 3 },
          { key: -5, from: 3, to: 0 },
        ]}
        onModelChange={() => {
          // alert('GoJS model changed!');
        }}
      />
    </div>
  );
}
