//
// Copyright © 2020 Province of British Columbia
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//

import { Label } from '@rebass/forms';
import React from 'react';
import { Field } from 'react-final-form';
import { Flex } from 'rebass';
import { useModal } from '../../hooks/useModal';
import getValidator from '../../utils/getValidator';
import { Modal } from '../common/modal/modal';
import CheckboxInput from '../common/UI/CheckboxInput';
import { Condition } from '../common/UI/FormControls';
import FormSubtitle from '../common/UI/FormSubtitle';
import FormTitle from '../common/UI/FormTitle';
import SelectInput from '../common/UI/SelectInput';
import TextAreaInput from '../common/UI/TextAreaInput';
import TextInput from '../common/UI/TextInput';
import { CreateFormGoldModal } from './CreateFormGoldModal';

interface MinistryItem {
  name: string;
  code: string;
}

interface ClusterItem {
  name: string;
}

interface ICreateFormProjectProps {
  ministry: Array<MinistryItem>;
  cluster: Array<ClusterItem>;
}

const CreateFormProject: React.FC<ICreateFormProjectProps> = (props) => {
  const validator = getValidator();
  // @ts-ignore
  const required = (value) => (value ? undefined : 'Required');
  const { ministry = [], cluster = [] } = props;
  const { isShown, toggle } = useModal();
  return (
    <div>
      <FormTitle>Tell us about your project</FormTitle>
      <FormSubtitle>
        If this is your first time on the OpenShift platform you need to book an alignment meeting
        with the Platform Services team; Reach out to{' '}
        <a rel="noopener noreferrer" href="mailto:olena.mitovska@gov.bc.ca" target="_blank">
          olena.mitovska@gov.bc.ca
        </a>{' '}
        to get started.
      </FormSubtitle>
      <Flex flexDirection="column">
        <Label htmlFor="project.name">Name</Label>
        <Field<string>
          name="profile.name"
          component={TextInput}
          placeholder="Project X"
          validate={validator.mustBeValidProfileName}
        />
      </Flex>
      <Flex flexDirection="column">
        <Label htmlFor="project.description">Description</Label>
        <Field
          name="profile.description"
          component={TextAreaInput}
          placeholder="A cutting edge web platform that enables Citizens to ..."
          validate={validator.mustBeValidProfileDescription}
          rows="5"
        />
      </Flex>
      <Flex mt={3}>
        <Label variant="adjacentLabel" m="auto">
          Is this a Priority Application?
        </Label>
        <Flex flex="1 1 auto" justifyContent="flex-end">
          <Field<boolean>
            name="profile.prioritySystem"
            component={CheckboxInput}
            defaultValue={false}
            type="checkbox"
          />
        </Flex>
      </Flex>
      <Flex mt={3}>
        <Label variant="adjacentLabel" m="auto">
          Ministry Sponsor
        </Label>
        <Flex flex="1 1 auto" justifyContent="flex-end" name="project.busOrgId">
          <Field name="profile.busOrgId" component={SelectInput} validate={required}>
            <option> Select... </option>
            {ministry.length > 0 &&
              ministry.map((s: any) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
          </Field>
        </Flex>
      </Flex>
      <Flex mt={3}>
        <Label variant="adjacentLabel" m="auto">
          Cluster Name
        </Label>
        <Flex flex="1 1 auto" justifyContent="flex-end" name="profile.primaryClusterName">
          <Field name="profile.primaryClusterName" component={SelectInput} validate={required}>
            <option> Select... </option>
            {cluster.length > 0 &&
              cluster.map((s: any) => (
                <option key={s.name} value={s.name}>
                  {s.displayName}
                </option>
              ))}
          </Field>
        </Flex>
      </Flex>
      <Condition when="profile.primaryClusterName" is="klab">
        <Flex mt={3}>
          <Label variant="adjacentLabel" m="auto">
            Configure Disaster Recovery?
          </Label>
          <Flex flex="1 1 auto" justifyContent="flex-end">
            <Field<boolean> name="profile.clabDR" component={CheckboxInput} type="checkbox" />
          </Flex>
        </Flex>
      </Condition>
      <Condition when="profile.primaryClusterName" is="gold">
        <Modal
          isShown={!isShown}
          hide={toggle}
          headerText="Note"
          modalContent={<CreateFormGoldModal />}
        />
      </Condition>
    </div>
  );
};

export default CreateFormProject;
