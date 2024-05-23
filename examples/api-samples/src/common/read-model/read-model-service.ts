// *****************************************************************************
// Copyright (C) 2024 TOBESOFT and others.
//
// This program and the accompanying materials are made available under the
// terms of the Eclipse Public License v. 2.0 which is available at
// http://www.eclipse.org/legal/epl-2.0.
//
// This Source Code may also be made available under the following Secondary
// Licenses when the conditions for such availability set forth in the Eclipse
// Public License v. 2.0 are satisfied: GNU General Public License, version 2
// with the GNU Classpath Exception which is available at
// https://www.gnu.org/software/classpath/license.html.
//
// SPDX-License-Identifier: EPL-2.0 OR GPL-2.0-only WITH Classpath-exception-2.0
// *****************************************************************************

import { RpcServer } from '@theia/core/lib/common/messaging/proxy-factory';

export const ReadModelPath = '/services/readModel';
export const ReadModel = Symbol('ReadModel');

export interface ParseNode {
    id: string;
    filePath: string;
    parseType: parseType;
    isDirectory?: boolean;
    parent?: string;
    children?: ParseNode[]
}

export type parseType = 'readModel' | 'readXml';
export type nodeType = 'mainRoot' | 'folder' | 'file' | 'model' | 'field';

export interface ReadModel extends RpcServer<ReadModelClient> {
    setClient(client: ReadModelClient | undefined): void;
    getClient(): ReadModelClient | undefined;
    readModel(): Promise<ParseNode[] | undefined>;
    parseModel(filePath: string): Promise<ParseNode[] | undefined>;
    checkIdRegex(nodeValue: string): Promise<boolean>;
    deleteNode(nodeName: string, filePath: string, type: string, parentName: string): Promise<boolean>;
    addNode(nodeName: string, filePath: string, type: string, nodeValue: string): Promise<boolean>;
}

export const ReadModelClient = Symbol('ReadModelClient');
export interface ReadModelClient {
}
