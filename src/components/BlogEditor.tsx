"use client"
import { useState } from "react"
import { ListItemNode, ListNode } from "@lexical/list"
import { CheckListPlugin } from "@lexical/react/LexicalCheckListPlugin"
import {
    InitialConfigType,
    LexicalComposer,
} from "@lexical/react/LexicalComposer"
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary"
import { ListPlugin } from "@lexical/react/LexicalListPlugin"
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin"
import { HeadingNode, QuoteNode } from "@lexical/rich-text"
import { ParagraphNode, SerializedEditorState, TextNode } from "lexical"

import { TooltipProvider } from "@/components/ui/tooltip"
import { editorTheme } from "./editor/themes/editor-theme"
import { ToolbarPlugin } from "./editor/plugins/toolbar/toolbar-plugin"
import { BlockFormatDropDown } from "./editor/plugins/toolbar/block-format-toolbar-plugin"
import { FormatParagraph } from "./editor/plugins/toolbar/block-format/format-paragraph"
import { FormatHeading } from "./editor/plugins/toolbar/block-format/format-heading"
import { FormatNumberedList } from "./editor/plugins/toolbar/block-format/format-numbered-list"
import { FormatBulletedList } from "./editor/plugins/toolbar/block-format/format-bulleted-list"
import { FormatCheckList } from "./editor/plugins/toolbar/block-format/format-check-list"
import { FormatQuote } from "./editor/plugins/toolbar/block-format/format-quote"
import { ContentEditable } from "./editor/editor-ui/content-editable"
const editorConfig: InitialConfigType = {
    namespace: "Editor",
    theme: editorTheme,
    nodes: [
        HeadingNode,
        ParagraphNode,
        TextNode,
        QuoteNode,
        ListNode,
        ListItemNode,
    ],
    onError: (error: Error) => {
        console.error(error)
    },
}
const initialValue = {
    root: {
        children: [
            {
                children: [
                    {
                        detail: 0,
                        format: 0,
                        mode: "normal",
                        style: "",
                        text: "Hello World 🚀",
                        type: "text",
                        version: 1,
                    },
                ],
                direction: "ltr",
                format: "",
                indent: 0,
                type: "paragraph",
                version: 1,
            },
        ],
        direction: "ltr",
        format: "",
        indent: 0,
        type: "root",
        version: 1,
    },
} as unknown as SerializedEditorState


export default function BlogEditor() {
    const [editorState, setEditorState] =
        useState<SerializedEditorState>(initialValue)

    return (
        <div className="bg-background w-full overflow-hidden rounded-lg border">
            <LexicalComposer
                initialConfig={{
                    ...editorConfig,
                }}
            >
                <TooltipProvider>
                    <Plugins />
                </TooltipProvider>
            </LexicalComposer>
        </div>
    )
}


const placeholder = "Start typing..."

export function Plugins() {
    const [floatingAnchorElem, setFloatingAnchorElem] =
        useState<HTMLDivElement | null>(null)
    const onRef = (_floatingAnchorElem: HTMLDivElement) => {
        if (_floatingAnchorElem !== null) {
            setFloatingAnchorElem(_floatingAnchorElem)
        }
    }
    return (
        <div className="relative">
            {/* toolbar plugins */}
            <ToolbarPlugin>
                {({ blockType }) => (
                    <div className="vertical-align-middle sticky top-0 z-10 flex gap-2 overflow-auto border-b p-1">
                        <BlockFormatDropDown>
                            <FormatParagraph />
                            <FormatHeading levels={["h1", "h2", "h3"]} />
                            <FormatNumberedList />
                            <FormatBulletedList />
                            <FormatCheckList />
                            <FormatQuote />
                        </BlockFormatDropDown>
                    </div>
                )}
            </ToolbarPlugin>
            <div className="relative">
                <RichTextPlugin
                    contentEditable={
                        <div className="">
                            <div className="" ref={onRef}>
                                <ContentEditable
                                    placeholder={placeholder}
                                    className="ContentEditable__root relative block h-72 overflow-auto px-8 py-4 focus:outline-none"
                                />
                            </div>
                        </div>
                    }
                    ErrorBoundary={LexicalErrorBoundary}
                />
                <ListPlugin />
                <CheckListPlugin />
                {/* rest of the plugins */}
            </div>
        </div>
    )
}