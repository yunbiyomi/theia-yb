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

export interface OptionsData {
    Configure: {
        Environment: {
            General: {
                workFolder: string;
                recentFileCount: number;
                recentPrjCount: number;
                commandType: number;
                toolTheme: number;
            }
        },
        FormDesign: {
            General: {
                undoMax: number;
                defaultWidth: number;
                defaultHeight: number;
                selectType: number;
            },
            LayoutManager: {
                displayEditStep: number;
            }
        }
        setEnvironment: string;
    }
}

export const OriginConfig: OptionsData = {
    Configure: {
        Environment: {
            General: {
                workFolder: "C:/Users/tobesoft/Documents/tobesoft/nexacro N/settings",
                recentFileCount: 4,
                recentPrjCount: 4,
                commandType: 0,
                toolTheme: 0
            }
        },
        FormDesign: {
            General: {
                undoMax: 1024,
                defaultWidth: 1280,
                defaultHeight: 720,
                selectType: 1
            },
            LayoutManager: {
                displayEditStep: 1
            }
        },
        setEnvironment: "developer"
    }
}

export enum COMMAND_TYPE {
    default,
    ribbon
}

export enum TOOL_THEME {
    default,
    black
}

export enum SELECT_TYPE {
    part,
    all
}
