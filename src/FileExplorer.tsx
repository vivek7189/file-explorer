import React, { useState } from 'react';

import filesData, { FileNode } from './models';

const ContextMenu: React.FC<{
  x: number;
  y: number;
  itemName: string;
  onAction: (action: string, itemName: string) => void;
}> = ({ x, y, itemName, onAction }) => {
  const handleAction = (action: string) => {
    onAction(action, itemName);
  };

  return (
    <ul className="context-menu" style={{ top: y, left: x }}>
      <li onClick={() => handleAction('copy')}>Copy</li>
      <li onClick={() => handleAction('delete')}>Delete</li>
      <li onClick={() => handleAction('rename')}>Rename</li>
    </ul>
  );
};

const FileExplorer: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [expandedFolders, setExpandedFolders] = useState<string[]>([]);
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    visible: boolean;
    itemName: string;
  }>({ x: 0, y: 0, visible: false, itemName: '' });

  const toggleFolder = (name: string) => {
    setExpandedFolders((expanded) =>
      expanded.includes(name)
        ? expanded.filter((n) => n !== name)
        : [...expanded, name]
    );
  };

  const handleContextMenu = (event: React.MouseEvent, name: string) => {
    event.preventDefault();
    setContextMenu({
      x: event.pageX,
      y: event.pageY,
      visible: true,
      itemName: name,
    });
  };

  const handleAction = (action: string, itemName: string) => {
    console.log(`${action} action for ${itemName}`);
    setContextMenu((prevState) => ({ ...prevState, visible: false }));
  };

  const handleComponentClick = () => {
    if (contextMenu.visible) {
      setContextMenu((prevState) => ({ ...prevState, visible: false }));
    }
  };

  const renderFiles = (data: FileNode[], level = 0): JSX.Element[] => {
    return data.map((item) => (
      <div
        key={item.name}
        style={{ paddingLeft: `${20 * level}px` }}
        className="file-item"
        onClick={handleComponentClick}
      >
        <div
          className={`file-entry ${
            selectedFile === item.name ? 'selected' : ''
          }`}
          onClick={() =>
            item.type === 'folder'
              ? toggleFolder(item.name)
              : setSelectedFile(item.name)
          }
          onContextMenu={(e) => handleContextMenu(e, item.name)}
        >
          {item.type === 'folder'
            ? expandedFolders.includes(item.name)
              ? '- '
              : '+ '
            : ''}{' '}
          [{item.type.toUpperCase()}] {item.name}
        </div>
        {item.type === 'folder' &&
          expandedFolders.includes(item.name) &&
          renderFiles(item.data || [], level + 1)}
      </div>
    ));
  };

  return (
    <div onClick={handleComponentClick}>
      {renderFiles(filesData.data || [])}
      {contextMenu.visible && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          itemName={contextMenu.itemName}
          onAction={handleAction}
        />
      )}
    </div>
  );
};

export default FileExplorer;
