import * as React from "react";
import * as ReactDom from "react-dom";
import { Version } from "@microsoft/sp-core-library";
import {
    IPropertyPaneConfiguration,
    PropertyPaneTextField,
} from "@microsoft/sp-property-pane";
import { BaseClientSideWebPart } from "@microsoft/sp-webpart-base";

import * as strings from "AbsentWebPartStrings";
import Absent from "./components/Absent";
import { SPHttpClient, SPHttpClientResponse } from "@microsoft/sp-http";

export interface IAbsentWebPartProps {
    absentList: string;
    division: string;
}

export interface IAbsentProps {
    division: string;
    getAbsent: any;
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

    protected async getAbsent(): Promise<SPHttpClientResponse> {
        console.log("refetching absent");
        let division = this.properties.division;

        if (!this.properties.division) {
            division = "Primary School";
        }

        const [today] = new Date().toISOString().split("T");
        console.log(today);
        const odata = [
            `$expand=Faculty,Coverage`,
            `$filter=Division eq '${division}' and Date le '${today}' and ReturnDate ge '${today}'`,
            `$select=Date,ReturnDate,Faculty/Title,Coverage/Title`,
        ];
        const endpoint =
            `https://keystoneacademy.sharepoint.com/sites/main` +
            `/_api/web/lists/getbytitle('Faculty Absences')/items`;

        const response = await this.context.spHttpClient.get(
            `${endpoint}?${odata.join("&")}`,
            SPHttpClient.configurations.v1
        );
        const json = await response.json();
        return json;
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
                                PropertyPaneTextField("description", {
                                    label: strings.DescriptionFieldLabel,
                                }),
                            ],
                        },
                    ],
                },
            ],
        };
    }
}
