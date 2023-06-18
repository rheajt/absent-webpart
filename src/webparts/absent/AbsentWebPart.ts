import * as React from "react";
import * as ReactDom from "react-dom";
import { Version } from "@microsoft/sp-core-library";
import {
    IPropertyPaneConfiguration,
    PropertyPaneDropdown,
    PropertyPaneTextField,
} from "@microsoft/sp-property-pane";
import { BaseClientSideWebPart } from "@microsoft/sp-webpart-base";

import * as strings from "AbsentWebPartStrings";
import Absent from "./components/Absent";
import { SPHttpClient } from "@microsoft/sp-http";
import { Absence } from "./components/Absence";

export interface IAbsentWebPartProps {
    absentSite: string;
    absentList: string;
    division: string;
}

export interface IAbsentProps {
    division: string;
    getAbsent: () => Promise<{ value: Absence[] }>;
}

export default class AbsentWebPart extends BaseClientSideWebPart<IAbsentWebPartProps> {
    public render(): void {
        const element: React.ReactElement<IAbsentProps> = React.createElement(
            Absent,
            {
                division: this.properties.division,
                getAbsent: this.getAbsent.bind(this),
            }
        );

        ReactDom.render(element, this.domElement);
    }

    protected async getAbsent(): Promise<{ value: Absence[] }> {
        let division = this.properties.division;
        if (!this.properties.division) {
            division = "Primary School";
        }

        const [today] = new Date().toISOString().split("T");
        const odata = [
            `$expand=Faculty,Coverage`,
            `$filter=Division eq '${division}' and Date le '${today}' and ReturnDate ge '${today}'`,
            `$select=Date,ReturnDate,Faculty/Title,Coverage/Title`,
        ];
        const endpoint =
            this.properties.absentSite +
            `/_api/web/lists/getbytitle('${this.properties.absentList}')/items`;

        const response = await this.context.spHttpClient.get(
            `${endpoint}?${odata.join("&")}`,
            SPHttpClient.configurations.v1
        );
        return response.json();
    }

    protected onDispose(): void {
        ReactDom.unmountComponentAtNode(this.domElement);
    }

    protected get dataVersion(): Version {
        return Version.parse("1.0");
    }

    protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
        return {
            pages: [
                {
                    header: {
                        description: strings.PropertyPaneDescription,
                    },
                    groups: [
                        {
                            groupName: strings.BasicGroupName,
                            groupFields: [
                                PropertyPaneTextField("absentSite", {
                                    label: "absent site",
                                    description:
                                        "the URL of the site that houses the the sharepoint list",
                                }),
                                PropertyPaneTextField("absentList", {
                                    label: "absent list",
                                    description:
                                        "The name of the list that stores the data for absent faculty",
                                }),
                                PropertyPaneDropdown("division", {
                                    selectedKey: "Primary School",
                                    label: "division",
                                    options: [
                                        {
                                            key: "Primary School",
                                            text: "Primary School",
                                        },
                                        {
                                            key: "Middle School",
                                            text: "Middle School",
                                        },
                                        {
                                            key: "High School",
                                            text: "High School",
                                        },
                                    ],
                                }),
                            ],
                        },
                    ],
                },
            ],
        };
    }
}
