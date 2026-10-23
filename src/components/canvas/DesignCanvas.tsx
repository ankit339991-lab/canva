import React, { useRef, useEffect, useState, useCallback } from 'react';
import { 
  Stage, 
  Layer, 
  Rect, 
  Circle, 
  Line, 
  Star, 
  Text as KonvaText, 
  Image as KonvaImage, 
  Path as KonvaPath, 
  Transformer, 
  Group 
} from 'react-konva';
import Konva from 'konva';
import { useEditorStore } from '../../store/useEditorStore';
import { 
  CanvasObject, 
  TextObject, 
  ShapeObject, 
  ImageObject, 
  SvgIconObject 
} from '../../types';

// Helper hook to load HTMLImageElement for canvas
function useHtmlImage(src: string) {
  const [image, setImage] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    if (!src) return;
    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.src = src;
    img.onload = () => setImage(img);
  }, [src]);

  return image;
}

// Image Object Component
const CanvasImageItem: React.FC<{
  shapeProps: ImageObject;
  isSelected: boolean;
  onSelect: () => void;
  onChange: (newAttrs: Partial<ImageObject>) => void;
}> = ({ shapeProps, isSelected, onSelect, onChange }) => {
  const image = useHtmlImage(shapeProps.src);
  const shapeRef = useRef<Konva.Image>(null);

  return (
    <KonvaImage
      ref={shapeRef}
      id={shapeProps.id}
      image={image || undefined}
      x={shapeProps.x}
      y={shapeProps.y}
      width={shapeProps.width}
      height={shapeProps.height}
      rotation={shapeProps.rotation || 0}
      opacity={shapeProps.opacity !== undefined ? shapeProps.opacity : 1}
      scaleX={shapeProps.flipX ? -1 : 1}
      scaleY={shapeProps.flipY ? -1 : 1}
      draggable={!shapeProps.locked}
      onClick={onSelect}
      onTap={onSelect}
      onDragEnd={(e) => {
        onChange({
          x: e.target.x(),
          y: e.target.y()
        });
      }}
      onTransformEnd={() => {
        const node = shapeRef.current;
        if (!node) return;
        const scaleX = node.scaleX();
        const scaleY = node.scaleY();

        node.scaleX(1);
        node.scaleY(1);

        onChange({
          x: node.x(),
          y: node.y(),
          width: Math.max(20, node.width() * Math.abs(scaleX)),
          height: Math.max(20, node.height() * Math.abs(scaleY)),
          rotation: node.rotation()
        });
      }}
    />
  );
};

// Text Object Component with Double-Click / Tap to Edit
const CanvasTextItem: React.FC<{
  shapeProps: TextObject;
  isSelected: boolean;
  isEditing: boolean;
  onSelect: () => void;
  onStartEdit: (shape: TextObject) => void;
  onChange: (newAttrs: Partial<TextObject>) => void;
}> = ({ shapeProps, isSelected, isEditing, onSelect, onStartEdit, onChange }) => {
  const textRef = useRef<Konva.Text>(null);

  return (
    <KonvaText
      ref={textRef}
      id={shapeProps.id}
      x={shapeProps.x}
      y={shapeProps.y}
      text={shapeProps.text}
      fontSize={shapeProps.fontSize}
      fontFamily={shapeProps.fontFamily}
      fontStyle={shapeProps.fontStyle === 'italic' ? 'italic' : shapeProps.fontWeight >= '600' ? 'bold' : 'normal'}
      fill={shapeProps.fill}
      align={shapeProps.textAlign}
      width={shapeProps.width}
      lineHeight={shapeProps.lineHeight || 1.2}
      letterSpacing={shapeProps.letterSpacing || 0}
      rotation={shapeProps.rotation || 0}
      opacity={isEditing ? 0 : shapeProps.opacity !== undefined ? shapeProps.opacity : 1}
      draggable={!shapeProps.locked && !isEditing}
      onClick={onSelect}
      onTap={onSelect}
      onDblClick={() => onStartEdit(shapeProps)}
      onDblTap={() => onStartEdit(shapeProps)}
      onDragEnd={(e) => {
        onChange({
          x: e.target.x(),
          y: e.target.y()
        });
      }}
      onTransformEnd={() => {
        const node = textRef.current;
        if (!node) return;
        const scaleX = node.scaleX();
        node.scaleX(1);
        node.scaleY(1);

        onChange({
          x: node.x(),
          y: node.y(),
          width: Math.max(40, node.width() * scaleX),
          rotation: node.rotation()
        });
      }}
    />
  );
};

// Shape Object Component
const CanvasShapeItem: React.FC<{
  shapeProps: ShapeObject;
  isSelected: boolean;
  onSelect: () => void;
  onChange: (newAttrs: Partial<ShapeObject>) => void;
}> = ({ shapeProps, isSelected, onSelect, onChange }) => {
  const shapeRef = useRef<any>(null);

  const commonProps = {
    ref: shapeRef,
    id: shapeProps.id,
    x: shapeProps.x,
    y: shapeProps.y,
    rotation: shapeProps.rotation || 0,
    opacity: shapeProps.opacity !== undefined ? shapeProps.opacity : 1,
    fill: shapeProps.fill,
    stroke: shapeProps.stroke,
    strokeWidth: shapeProps.strokeWidth || 0,
    draggable: !shapeProps.locked,
    shadowColor: shapeProps.shadowColor,
    shadowBlur: shapeProps.shadowBlur,
    shadowOffset: {
      x: shapeProps.shadowOffsetX || 0,
      y: shapeProps.shadowOffsetY || 0
    },
    onClick: onSelect,
    onTap: onSelect,
    onDragEnd: (e: any) => {
      onChange({
        x: e.target.x(),
        y: e.target.y()
      });
    },
    onTransformEnd: () => {
      const node = shapeRef.current;
      if (!node) return;
      const scaleX = node.scaleX();
      const scaleY = node.scaleY();
      node.scaleX(1);
      node.scaleY(1);

      onChange({
        x: node.x(),
        y: node.y(),
        width: Math.max(10, node.width() * scaleX),
        height: Math.max(10, node.height() * scaleY),
        rotation: node.rotation()
      });
    }
  };

  if (shapeProps.type === 'circle') {
    const radius = shapeProps.width / 2;
    return (
      <Circle
        {...commonProps}
        radius={radius}
        x={shapeProps.x + radius}
        y={shapeProps.y + radius}
        onDragEnd={(e) => {
          onChange({
            x: e.target.x() - radius,
            y: e.target.y() - radius
          });
        }}
      />
    );
  }

  if (shapeProps.type === 'star') {
    return (
      <Star
        {...commonProps}
        numPoints={shapeProps.numPoints || 5}
        innerRadius={shapeProps.innerRadius || shapeProps.width * 0.25}
        outerRadius={shapeProps.outerRadius || shapeProps.width * 0.5}
        x={shapeProps.x + shapeProps.width / 2}
        y={shapeProps.y + shapeProps.height / 2}
        onDragEnd={(e) => {
          onChange({
            x: e.target.x() - shapeProps.width / 2,
            y: e.target.y() - shapeProps.height / 2
          });
        }}
      />
    );
  }

  if (shapeProps.type === 'line') {
    return (
      <Line
        {...commonProps}
        points={shapeProps.points || [0, 0, shapeProps.width, shapeProps.height]}
        lineCap="round"
        lineJoin="round"
      />
    );
  }

  // Default: Rectangle
  return (
    <Rect
      {...commonProps}
      width={shapeProps.width}
      height={shapeProps.height}
      cornerRadius={shapeProps.cornerRadius || 0}
    />
  );
};

// SVG Icon Component
const CanvasSvgIconItem: React.FC<{
  shapeProps: SvgIconObject;
  isSelected: boolean;
  onSelect: () => void;
  onChange: (newAttrs: Partial<SvgIconObject>) => void;
}> = ({ shapeProps, isSelected, onSelect, onChange }) => {
  const pathRef = useRef<Konva.Path>(null);

  return (
    <KonvaPath
      ref={pathRef}
      id={shapeProps.id}
      data={shapeProps.svgPath}
      x={shapeProps.x}
      y={shapeProps.y}
      width={shapeProps.width}
      height={shapeProps.height}
      fill={shapeProps.fill}
      stroke={shapeProps.stroke}
      strokeWidth={shapeProps.strokeWidth || 0}
      rotation={shapeProps.rotation || 0}
      opacity={shapeProps.opacity !== undefined ? shapeProps.opacity : 1}
      draggable={!shapeProps.locked}
      scaleX={shapeProps.width / 24} // normalized from 24x24 icon viewport
      scaleY={shapeProps.height / 24}
      onClick={onSelect}
      onTap={onSelect}
      onDragEnd={(e) => {
        onChange({
          x: e.target.x(),
          y: e.target.y()
        });
      }}
      onTransformEnd={() => {
        const node = pathRef.current;
        if (!node) return;
        const scaleX = node.scaleX();
        const scaleY = node.scaleY();
        node.scaleX(1);
        node.scaleY(1);

        onChange({
          x: node.x(),
          y: node.y(),
          width: Math.max(10, node.width() * scaleX),
          height: Math.max(10, node.height() * scaleY),
          rotation: node.rotation()
        });
      }}
    />
  );
};

export interface DesignCanvasProps {
  onExportReady?: (stage: Konva.Stage) => void;
}

export const DesignCanvas: React.FC<DesignCanvasProps> = ({ onExportReady }) => {
  const {
    document,
    selectedId,
    setSelectedId,
    updateObject,
    zoom,
    pan,
    setPan,
    setZoom,
    resetView
  } = useEditorStore();

  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<Konva.Stage>(null);
  const transformerRef = useRef<Konva.Transformer>(null);
  const [guides, setGuides] = useState<{ x?: number; y?: number }>({});
  const [containerSize, setContainerSize] = useState({ width: 800, height: 600 });
  const [isSpacePressed, setIsSpacePressed] = useState(false);
  const [editingTextNode, setEditingTextNode] = useState<{
    id: string;
    text: string;
    x: number;
    y: number;
    width: number;
    height: number;
    rotation: number;
    fontSize: number;
    fontFamily: string;
    fontWeight: string | number;
    fontStyle?: string;
    fill: string;
    textAlign: string;
    lineHeight: number;
  } | null>(null);

  const activePage = document.pages[document.activePageIndex] || document.pages[0];
  const { width: canvasWidth, height: canvasHeight } = document.dimensions;

  // Resize container listener
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const width = containerRef.current.clientWidth;
        const height = containerRef.current.clientHeight;
        setContainerSize({ width, height });
        resetView(width, height);
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Keyboard navigation & Shortcuts (Space to pan, Delete, Undo/Redo)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in input or textarea
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      if (e.code === 'Space') {
        setIsSpacePressed(true);
      }

      // Undo / Redo
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          useEditorStore.getState().redo();
        } else {
          useEditorStore.getState().undo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        useEditorStore.getState().redo();
      }

      // Duplicate
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        useEditorStore.getState().duplicateSelected();
      }

      // Delete
      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        useEditorStore.getState().deleteSelected();
      }

      // Nudging with arrows
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
        const selId = useEditorStore.getState().selectedId;
        if (!selId) return;
        const delta = e.shiftKey ? 10 : 1;
        const page = document.pages[document.activePageIndex];
        const target = page.objects.find((o) => o.id === selId);
        if (!target) return;

        let { x, y } = target;
        if (e.key === 'ArrowUp') y -= delta;
        if (e.key === 'ArrowDown') y += delta;
        if (e.key === 'ArrowLeft') x -= delta;
        if (e.key === 'ArrowRight') x += delta;

        useEditorStore.getState().updateObject(selId, { x, y });
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        setIsSpacePressed(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [document]);

  // Synchronize Konva Transformer with active selectedId
  useEffect(() => {
    if (!transformerRef.current || !stageRef.current) return;

    if (!selectedId) {
      transformerRef.current.nodes([]);
      transformerRef.current.getLayer()?.batchDraw();
      return;
    }

    const selectedNode = stageRef.current.findOne('#' + selectedId);
    if (selectedNode) {
      transformerRef.current.nodes([selectedNode]);
      transformerRef.current.getLayer()?.batchDraw();
    } else {
      transformerRef.current.nodes([]);
      transformerRef.current.getLayer()?.batchDraw();
    }
  }, [selectedId, activePage]);

  // Handle stage mouse wheel for zooming
  const handleWheel = (e: any) => {
    e.evt.preventDefault();
    const stage = stageRef.current;
    if (!stage) return;

    const oldScale = zoom;
    const pointer = stage.getPointerPosition() || { x: containerSize.width / 2, y: containerSize.height / 2 };

    const scaleBy = 1.05;
    const newScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;
    const clampedScale = Math.min(Math.max(newScale, 0.1), 3.0);

    // Zoom centered at cursor
    const mousePointTo = {
      x: (pointer.x - pan.x) / oldScale,
      y: (pointer.y - pan.y) / oldScale
    };

    const newPan = {
      x: pointer.x - mousePointTo.x * clampedScale,
      y: pointer.y - mousePointTo.y * clampedScale
    };

    setZoom(clampedScale);
    setPan(newPan);
  };

  // Click on stage background deselects objects
  const handleStageClick = (e: any) => {
    if (e.target === stageRef.current || e.target.name() === 'canvas-background-card') {
      setSelectedId(null);
    }
  };

  // Pass stage instance for export
  useEffect(() => {
    if (stageRef.current && onExportReady) {
      onExportReady(stageRef.current);
    }
  }, [onExportReady]);

  return (
    <div 
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden bg-slate-950 select-none ${
        isSpacePressed ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'
      }`}
    >
      <Stage
        ref={stageRef}
        width={containerSize.width}
        height={containerSize.height}
        x={pan.x}
        y={pan.y}
        scaleX={zoom}
        scaleY={zoom}
        draggable={isSpacePressed}
        onWheel={handleWheel}
        onClick={handleStageClick}
        onTap={handleStageClick}
        onDragEnd={(e) => {
          if (e.target === stageRef.current) {
            setPan({ x: e.target.x(), y: e.target.y() });
          }
        }}
      >
        {/* Layer 1: Design Canvas Paper/Card */}
        <Layer>
          {/* Canvas Card Shadow */}
          <Rect
            x={0}
            y={0}
            width={canvasWidth}
            height={canvasHeight}
            fill="#000000"
            opacity={0.35}
            shadowColor="#000000"
            shadowBlur={40}
            shadowOffset={{ x: 0, y: 20 }}
            shadowOpacity={0.6}
            listening={false}
          />

          {/* Canvas Background Surface */}
          <Rect
            name="canvas-background-card"
            x={0}
            y={0}
            width={canvasWidth}
            height={canvasHeight}
            fill={activePage.background.type === 'color' ? activePage.background.value : '#ffffff'}
            cornerRadius={4}
          />
        </Layer>

        {/* Layer 2: Design Objects (Rendered in Array Order for Z-Index) */}
        <Layer>
          {activePage.objects.map((obj) => {
            const isSelected = obj.id === selectedId;

            if (obj.type === 'text') {
              const textObj = obj as TextObject;
              const isEditing = editingTextNode?.id === textObj.id;
              return (
                <CanvasTextItem
                  key={textObj.id}
                  shapeProps={textObj}
                  isSelected={isSelected}
                  isEditing={isEditing}
                  onSelect={() => setSelectedId(textObj.id)}
                  onStartEdit={(target) => {
                    setEditingTextNode({
                      id: target.id,
                      text: target.text,
                      x: target.x,
                      y: target.y,
                      width: target.width,
                      height: Math.max(target.height || 60, target.fontSize * 1.5),
                      rotation: target.rotation || 0,
                      fontSize: target.fontSize,
                      fontFamily: target.fontFamily,
                      fontWeight: target.fontWeight,
                      fontStyle: target.fontStyle,
                      fill: target.fill,
                      textAlign: target.textAlign,
                      lineHeight: target.lineHeight || 1.2
                    });
                  }}
                  onChange={(updates) => updateObject(textObj.id, updates)}
                />
              );
            }


            if (obj.type === 'image') {
              return (
                <CanvasImageItem
                  key={obj.id}
                  shapeProps={obj as ImageObject}
                  isSelected={isSelected}
                  onSelect={() => setSelectedId(obj.id)}
                  onChange={(updates) => updateObject(obj.id, updates)}
                />
              );
            }

            if (obj.type === 'svg-icon') {
              return (
                <CanvasSvgIconItem
                  key={obj.id}
                  shapeProps={obj as SvgIconObject}
                  isSelected={isSelected}
                  onSelect={() => setSelectedId(obj.id)}
                  onChange={(updates) => updateObject(obj.id, updates)}
                />
              );
            }

            // Primitive Shapes
            return (
              <CanvasShapeItem
                key={obj.id}
                shapeProps={obj as ShapeObject}
                isSelected={isSelected}
                onSelect={() => setSelectedId(obj.id)}
                onChange={(updates) => updateObject(obj.id, updates)}
              />
            );
          })}
        </Layer>

        {/* Layer 3: Interactive Selection Handles & Alignment Guidelines */}
        <Layer>
          {/* Horizontal Center Guide */}
          {guides.y !== undefined && (
            <Line
              points={[0, guides.y, canvasWidth, guides.y]}
              stroke="#ec4899"
              strokeWidth={1 / zoom}
              dash={[4 / zoom, 4 / zoom]}
            />
          )}

          {/* Vertical Center Guide */}
          {guides.x !== undefined && (
            <Line
              points={[guides.x, 0, guides.x, canvasHeight]}
              stroke="#ec4899"
              strokeWidth={1 / zoom}
              dash={[4 / zoom, 4 / zoom]}
            />
          )}

          {/* Konva Transformer Handle */}
          <Transformer
            ref={transformerRef}
            rotateAnchorOffset={28}
            rotationSnaps={[0, 45, 90, 135, 180, 225, 270, 315]}
            borderStroke="#8b5cf6"
            borderStrokeWidth={2 / zoom}
            anchorStroke="#8b5cf6"
            anchorFill="#ffffff"
            anchorSize={9 / zoom}
            anchorCornerRadius={2 / zoom}
            enabledAnchors={[
              'top-left',
              'top-center',
              'top-right',
              'middle-right',
              'bottom-right',
              'bottom-center',
              'bottom-left',
              'middle-left'
            ]}
            boundBoxFunc={(oldBox, newBox) => {
              // Prevent dragging to negative or zero dimensions
              if (Math.abs(newBox.width) < 10 || Math.abs(newBox.height) < 10) {
                return oldBox;
              }
              return newBox;
            }}
          />
        </Layer>
      </Stage>

      {/* Real HTML DOM Textarea Overlay for In-Place Canvas Text Editing */}
      {editingTextNode && (
        <textarea
          autoFocus
          value={editingTextNode.text}
          onChange={(e) => {
            const newText = e.target.value;
            setEditingTextNode((prev) => (prev ? { ...prev, text: newText } : null));
            updateObject(editingTextNode.id, { text: newText }, false);
          }}
          onBlur={() => {
            updateObject(editingTextNode.id, { text: editingTextNode.text }, true);
            setEditingTextNode(null);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              updateObject(editingTextNode.id, { text: editingTextNode.text }, true);
              setEditingTextNode(null);
            }
            // Allow Enter for new lines but stop propagation to prevent toolbar interference
            e.stopPropagation();
          }}
          style={{
            position: 'absolute',
            // editingTextNode.x / .y now store screen px coordinates relative to container
            left: `${editingTextNode.x * zoom + pan.x}px`,
            top: `${editingTextNode.y * zoom + pan.y}px`,
            width: `${Math.max(180, editingTextNode.width * zoom)}px`,
            minHeight: `${Math.max(40, editingTextNode.fontSize * zoom * 1.5)}px`,
            fontSize: `${Math.max(11, editingTextNode.fontSize * zoom)}px`,
            fontFamily: `${editingTextNode.fontFamily}, sans-serif`,
            fontWeight: editingTextNode.fontWeight as any,
            fontStyle: editingTextNode.fontStyle === 'italic' ? 'italic' : 'normal',
            color: '#1e293b',
            textAlign: editingTextNode.textAlign as any,
            lineHeight: editingTextNode.lineHeight || 1.2,
            background: 'rgba(255, 255, 255, 0.97)',
            border: '2.5px solid #8b5cf6',
            borderRadius: '6px',
            padding: '6px 10px',
            outline: 'none',
            boxShadow: '0 4px 24px rgba(0,0,0,0.4), 0 0 0 3px rgba(139,92,246,0.2)',
            transformOrigin: 'top left',
            transform: editingTextNode.rotation ? `rotate(${editingTextNode.rotation}deg)` : undefined,
            zIndex: 100,
            resize: 'both',
            overflowY: 'auto',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}
        />
      )}
    </div>
  );
};
