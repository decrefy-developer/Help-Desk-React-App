import {
  Button,
  Flex,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import moment from 'moment';
import React, { RefObject } from 'react';
import { useReactToPrint } from 'react-to-print';
import { IMember, ITicket } from '../../../../../models/interface';
import {
  desktopSupport,
  enterpriceApp,
  laptopSupport,
  mobileSupport,
  peripheralsAccessoriesSupport,
  POSSupport,
  userAccountManagement,
} from './categories';

interface TickProps {
  title: string;
  justify: 'center' | 'flex-start';
  tick: boolean | undefined;
  [x: string]: any;
}

interface Props {
  onClose: () => void;
  isOpen: boolean;
  componentRef: RefObject<HTMLDivElement>;
  data: ITicket | undefined;
}

const PrintPageSS: React.FC<Props> = ({
  onClose,
  isOpen,
  componentRef,
  data,
}) => {
  const printHandler = useReactToPrint({
    content: () => componentRef.current,
  });

  return (
    <Modal onClose={onClose} size="full" isOpen={isOpen}>
      <ModalOverlay />
      <ModalContent backgroundColor="white">
        <ModalHeader>SR Preview</ModalHeader>
        <ModalCloseButton />
        <ModalBody padding={10}>
          <div ref={componentRef} style={{ padding: '20px' }}>
            <Flex direction="column" p={5} color="black">
              <Heading ticketNumber={data?.ticketNumber} />
              <TitleComponent title="JOB ORDER" />
              <JobOrder
                requesterBy={data?.requesterName}
                department={data?.department.name}
                dateStart={data?.createdAt}
                dateCompleted={data?.doneDate}
              />
              <TitleComponent title="CATEGORY" />
              <Category
                subCategories={data?.subCategory}
                category={data?.category}
              />
              <TitleComponent title="ACTIVITY" />
              <Activity
                concern={data?.description}
                resolution={data?.solution}
              />
              <Material
                requester={data?.requesterName}
                user={`${data?.user.firstName} ${data?.user.lastName}`}
                coworker={data?.coworkers}
              />
              <Footer
                ticketNumber={data?.ticketNumber}
                closedBy={
                  data?.closedBy
                    ? `${data?.closedBy?.firstName} ${data?.closedBy?.lastName}`
                    : ' .'
                }
                createdBy={`${data?.createdBy?.firstName} ${data?.createdBy?.lastName}`}
              />
            </Flex>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button onClick={printHandler}>print</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default PrintPageSS;

const Heading = ({ ticketNumber }: { ticketNumber: string | undefined }) => {
  return (
    <div style={{ border: 'solid gray 1px' }}>
      <div style={{ display: 'flex', width: '100%' }}>
        <div
          style={{
            width: '15%',
            borderRight: 'solid gray 1px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Image src="/RDF Logo.png" alt="rdf_logo" width={20} />
        </div>
        <div style={{ width: '85%' }}>
          <div
            style={{
              fontStyle: 'italic',
              fontWeight: 'normal',
              fontSize: '9px',
              borderBottom: 'solid gray 1px',
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ padding: '2px' }}>
              This document is for INTERNAL USE ONLY. Limited copies may be made
              only by RDF employees, or by contractors and third parties who
              have signed an appropriate nondisclosure agreement or with prior
              written consent from management
            </div>
            <div
              style={{
                borderLeft: 'solid gray 1px',
                paddingRight: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: 'bold',
              }}
            >
              {`#${ticketNumber}`}
            </div>
          </div>
          <div
            style={{
              borderBottom: 'solid gray 1px',
              display: 'flex',
              justifyContent: 'center',
              padding: '2px',
              fontSize: '11px',
              fontWeight: 'bold',
            }}
          >
            SERVICE REPORT
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              padding: '2px',
              fontSize: '11px',
              fontWeight: 'bold',
            }}
          >
            MANAGEMENT INFORMATION SYSTEM
          </div>
        </div>
      </div>
    </div>
  );
};

const TitleComponent = ({ title }: { title: string }) => {
  return (
    <div
      style={{
        fontWeight: 'normal',
        display: 'flex',
        justifyContent: 'center',
        borderRight: 'solid gray 1px',
        borderLeft: 'solid gray 1px',
        borderBottom: 'solid gray 1px',
        backgroundColor: 'lightgray',
        fontSize: '11px',
      }}
    >
      {title}
    </div>
  );
};

const JobOrder = ({
  requesterBy,
  department,
  dateStart,
  dateCompleted,
}: {
  requesterBy: string | undefined;
  department: string | undefined;
  dateStart: Date | undefined;
  dateCompleted: Date | undefined;
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        borderBottom: 'solid gray 1px',
      }}
    >
      <div style={{ width: '50%', borderRight: 'solid gray 1px' }}>
        <div
          style={{
            borderBottom: 'solid gray 1px',
            borderLeft: 'solid gray 1px',
            display: 'flex',
            justifyContent: 'space-between',
            paddingLeft: '5px',
            paddingRight: '8px',
            fontSize: '11px',
          }}
        >
          <div>Site:</div>
          <TickComponent tick={false} justify="flex-start" title="Office" />
          <TickComponent tick={false} justify="flex-start" title="Store" />
          <TickComponent tick={false} justify="flex-start" title="Farm" />
          <TickComponent tick={false} justify="flex-start" title="Depot" />
        </div>

        <div
          style={{
            borderBottom: 'solid gray 1px',
            borderLeft: 'solid gray 1px',
            fontSize: '11px',
            paddingLeft: '5px',
          }}
        >
          Dept. / Store / Farm: {department}
        </div>
        <div
          style={{
            fontSize: '11px',
            paddingLeft: '5px',
            borderLeft: 'solid gray 1px',
          }}
        >
          Requested by: {requesterBy}
        </div>
      </div>

      <div style={{ width: '50%' }}>
        <div
          style={{
            borderBottom: 'solid gray 1px',
            borderRight: 'solid gray 1px',
            display: 'flex',
            justifyContent: 'space-between',
            paddingLeft: '5px',
            paddingRight: '8px',
            fontSize: '11px',
          }}
        >
          <div>Type of Request:</div>
          <TickComponent tick={false} justify="flex-start" title="New" />
          <TickComponent tick={false} justify="flex-start" title="Back-Job" />
        </div>

        <div
          style={{
            borderBottom: 'solid gray 1px',
            fontSize: '11px',
            paddingLeft: '5px',
            borderRight: 'solid gray 1px',
          }}
        >
          Date & Time Started: {moment(dateStart).format('MM-DD-YYYY')}
        </div>
        <div
          style={{
            fontSize: '11px',
            paddingLeft: '5px',
            borderRight: 'solid gray 1px',
          }}
        >
          Date & Time Finished: {moment(dateCompleted).format('MM-DD-YYYY')}
        </div>
      </div>
    </div>
  );
};

const TickComponent: React.FC<TickProps> = (props) => {
  const { justify, title, tick } = props;
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: justify,
        alignItems: 'center',
      }}
    >
      <div
        style={{
          height: '11px',
          width: '11px',
          border: 'solid gray 1px',
          marginRight: '5px',
          backgroundColor: tick ? 'grey' : 'none',
        }}
      ></div>
      <div>{title}</div>
    </div>
  );
};

const SubTitle = ({ title }: { title: string }) => {
  return (
    <div
      style={{
        backgroundColor: 'lightgray',
        display: 'flex',
        justifyContent: 'center',
        fontSize: '11px',
        borderBottom: 'solid gray 1px',
      }}
    >
      {title}
    </div>
  );
};

const Category = ({
  subCategories,
  category,
}: {
  subCategories: Array<{ _id: string; name: string }> | undefined;
  category: { _id: string; name: string } | undefined;
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        borderRight: 'solid gray 1px',
        borderLeft: 'solid gray 1px',
        borderBottom: 'solid gray 1px',
      }}
    >
      <div style={{ width: '40%', borderRight: 'solid gray 1px' }}>
        <div style={{ borderBottom: 'solid gray 1px' }}>
          <SubTitle title="Peripherals/Accessories Support" />
          <div style={{ fontSize: '10px', padding: '5px' }}>
            {peripheralsAccessoriesSupport.map((item, x) => (
              <TickComponent
                key={x}
                tick={
                  category?.name === 'Peripherals/Accessories Support'
                    ? subCategories?.some((sub) => {
                        if (item === sub.name) return true;
                        return false;
                      })
                    : false
                }
                justify="flex-start"
                title={item}
              />
            ))}
          </div>
        </div>

        <div style={{ borderBottom: 'solid gray 1px' }}>
          <SubTitle title="Enterprise Apps Dev & Support" />
          <div style={{ fontSize: '10px', padding: '5px' }}>
            {enterpriceApp.map((item, x) => (
              <TickComponent
                key={x}
                tick={
                  category?.name === 'Enterprise Apps Dev & Support'
                    ? subCategories?.some((sub) => {
                        if (item === sub.name) return true;
                        return false;
                      })
                    : false
                }
                justify="flex-start"
                title={item}
              />
            ))}
          </div>
        </div>

        <div>
          <SubTitle title="User Account Management" />
          <div style={{ fontSize: '10px', padding: '5px' }}>
            {userAccountManagement.map((item, x) => (
              <TickComponent
                key={x}
                tick={
                  category?.name === 'User Account Management'
                    ? subCategories?.some((sub) => {
                        if (item === sub.name) return true;
                        return false;
                      })
                    : false
                }
                justify="flex-start"
                title={item}
              />
            ))}
          </div>
        </div>
      </div>

      <div
        style={{
          width: '80%',
        }}
      >
        <SubTitle title="Desktop Support" />
        <div
          style={{
            display: 'flex',
          }}
        >
          <div
            style={{
              width: '50%',
              paddingLeft: '5px',
              paddingTop: '5px',
            }}
          >
            <div style={{ fontSize: '12px', fontWeight: 'bold' }}>
              <TickComponent
                tick={false}
                justify="flex-start"
                title="Desktop Support"
              />
            </div>
            <div style={{ fontSize: '10px', paddingLeft: '5px' }}>
              {desktopSupport.map((item, x) => (
                <TickComponent
                  key={x}
                  tick={
                    category?.name === 'Desktop Support (SS)'
                      ? subCategories?.some((sub) => {
                          if (item === sub.name) return true;
                          return false;
                        })
                      : false
                  }
                  justify="flex-start"
                  title={item}
                />
              ))}
            </div>

            <div
              style={{
                marginTop: '5px',
                fontSize: '12px',
                fontWeight: 'bold',
              }}
            >
              <TickComponent
                tick={false}
                justify="flex-start"
                title="Laptop Support"
              />
            </div>
            <div style={{ fontSize: '10px', paddingLeft: '5px' }}>
              {laptopSupport.map((item, x) => (
                <TickComponent
                  key={x}
                  tick={
                    category?.name === 'Laptop Support (SS)'
                      ? subCategories?.some((sub) => {
                          if (item === sub.name) return true;
                          return false;
                        })
                      : false
                  }
                  justify="flex-start"
                  title={item}
                />
              ))}
            </div>

            <div
              style={{
                marginTop: '5px',
                fontSize: '12px',
                fontWeight: 'bold',
              }}
            >
              <TickComponent
                tick={false}
                justify="flex-start"
                title="Mobile Support"
              />
            </div>
            <div style={{ fontSize: '10px', paddingLeft: '5px' }}>
              {mobileSupport.map((item, x) => (
                <TickComponent
                  key={x}
                  tick={
                    category?.name === 'Mobile Support (SS)'
                      ? subCategories?.some((sub) => {
                          if (item === sub.name) return true;
                          return false;
                        })
                      : false
                  }
                  justify="flex-start"
                  title={item}
                />
              ))}
            </div>
          </div>

          <div style={{ width: '50%', paddingLeft: '5px', paddingTop: '5px' }}>
            <div style={{ fontSize: '12px', fontWeight: 'bold' }}>
              <TickComponent
                tick={false}
                justify="flex-start"
                title="POS Support (SS)"
              />
            </div>
            <div style={{ fontSize: '11px', paddingLeft: '5px' }}>
              {POSSupport.map((item, x) => (
                <TickComponent
                  key={x}
                  tick={
                    category?.name === 'POS Support (SS)'
                      ? subCategories?.some((sub) => {
                          if (item === sub.name) return true;
                          return false;
                        })
                      : false
                  }
                  justify="flex-start"
                  title={item}
                />
              ))}
            </div>

            <div
              style={{
                marginTop: '10px',
                fontSize: '12px',
              }}
            >
              <div>Other Specify: ___________________</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Activity = ({
  concern,
  resolution,
}: {
  concern: string | undefined;
  resolution: string | undefined;
}) => {
  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-around',
          borderRight: 'solid gray 1px',
          borderLeft: 'solid gray 1px',
          borderBottom: 'solid gray 1px',
        }}
      >
        <div style={{ fontSize: '11px' }}>
          <TickComponent
            tick={false}
            justify="flex-start"
            title="Installation and Configuration"
          />
          <TickComponent
            tick={false}
            justify="flex-start"
            title="Repair and Troubleshoot"
          />
          <TickComponent tick={false} justify="flex-start" title="Backup" />
          <TickComponent tick={false} justify="flex-start" title="Recovery" />
          <TickComponent tick={false} justify="flex-start" title="Reformat" />
          <TickComponent
            tick={false}
            justify="flex-start"
            title="Replacement/Recommendation"
          />
        </div>
        <div style={{ fontSize: '11px' }}>
          <TickComponent
            tick={false}
            justify="flex-start"
            title="Security Management"
          />
          <TickComponent
            tick={false}
            justify="flex-start"
            title="Transfer Files"
          />
          <TickComponent tick={false} justify="flex-start" title="Diagnose" />
          <TickComponent
            tick={false}
            justify="flex-start"
            title="Generate Data"
          />
          <TickComponent
            tick={false}
            justify="flex-start"
            title="Upload Data"
          />
        </div>
        <div style={{ fontSize: '11px' }}>
          <TickComponent
            tick={false}
            justify="flex-start"
            title="User Account Credentials"
          />
          <TickComponent tick={false} justify="flex-start" title="Activation" />
          <TickComponent
            tick={false}
            justify="flex-start"
            title="Deactivation"
          />
          <TickComponent
            tick={false}
            justify="flex-start"
            title="Transfer Database"
          />
          <TickComponent
            tick={false}
            justify="flex-start"
            title="Cleaning, Scan and Diagnose"
          />
          <TickComponent
            tick={false}
            justify="flex-start"
            title="Corrective Maintenance Services"
          />
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          borderBottom: 'solid gray 1px',
          borderRight: 'solid gray 1px',
          borderLeft: 'solid gray 1px',
          fontSize: '11px',
          padding: '2px',
          justifyContent: 'flex-start',
        }}
      >
        <div style={{ fontWeight: 'bold' }}>Mode:</div>
        <div style={{ marginLeft: '20px' }}>
          <TickComponent tick={false} justify="flex-start" title="On Site" />
        </div>
        <div style={{ marginLeft: '10px' }}>
          <TickComponent tick={false} justify="flex-start" title="Phone Call" />
        </div>
        <div style={{ marginLeft: '10px' }}>
          <TickComponent tick={false} justify="flex-start" title="Walk-in" />
        </div>
        <div style={{ marginLeft: '10px' }}>
          <TickComponent tick={false} justify="flex-start" title="E-mail" />
        </div>
        <div style={{ marginLeft: '10px' }}>
          <TickComponent tick={false} justify="flex-start" title="Web Form" />
        </div>
        <div style={{ marginLeft: '10px' }}>
          <TickComponent tick={false} justify="flex-start" title="Memo" />
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          borderBottom: 'solid gray 1px',
          borderRight: 'solid gray 1px',
          borderLeft: 'solid gray 1px',
          fontSize: '11px',
          padding: '2px',
          justifyContent: 'flex-start',
        }}
      >
        <div style={{ fontWeight: 'bold' }}>Status:</div>
        <div style={{ marginLeft: '20px' }}>
          <TickComponent tick={false} justify="flex-start" title="Open" />
        </div>
        <div style={{ marginLeft: '10px' }}>
          <TickComponent tick={false} justify="flex-start" title="Closed" />
        </div>
        <div style={{ marginLeft: '10px' }}>
          <TickComponent tick={false} justify="flex-start" title="On Hold" />
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          borderBottom: 'solid gray 1px',
          borderRight: 'solid gray 1px',
          borderLeft: 'solid gray 1px',
          fontSize: '11px',
          padding: '2px',
          justifyContent: 'flex-start',
        }}
      >
        <div style={{ fontWeight: 'bold' }}>Support Classification:</div>
        <div style={{ marginLeft: '20px' }}>
          <TickComponent
            tick={false}
            justify="flex-start"
            title="Support Assistance"
          />
        </div>
        <div style={{ marginLeft: '20px' }}>
          <TickComponent tick={false} justify="flex-start" title="User Error" />
        </div>
        <div style={{ marginLeft: '20px' }}>
          <TickComponent
            tick={false}
            justify="flex-start"
            title="Hardware Error"
          />
        </div>
        <div style={{ marginLeft: '20px' }}>
          <TickComponent
            tick={false}
            justify="flex-start"
            title="System Error"
          />
        </div>
        <div style={{ marginLeft: '20px' }}>
          <TickComponent
            tick={false}
            justify="flex-start"
            title="System Update"
          />
        </div>
        <div style={{ marginLeft: '20px' }}>
          <TickComponent
            tick={false}
            justify="flex-start"
            title="Enhancement"
          />
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          borderBottom: 'solid gray 1px',
          borderRight: 'solid gray 1px',
          borderLeft: 'solid gray 1px',
          fontSize: '11px',
          flexDirection: 'column',
        }}
      >
        <div style={{ width: '100%' }}>
          <SubTitle title="ISSUE DESCRIPTION" />
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-start',
              fontSize: '12px',
              padding: '3px',
              minHeight: '30px',
            }}
          >
            {concern}
          </div>
        </div>
        <div style={{ width: '100%' }}>
          <SubTitle title="RESOLUTION/REMARKS" />
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-start',
              fontSize: '12px',
              padding: '3px',
              minHeight: '30px',
            }}
          >
            {resolution}
          </div>
        </div>
      </div>
    </div>
  );
};

const Material = ({
  requester,
  user,
  coworker,
}: {
  requester: string | undefined;
  user: string | undefined;
  coworker:
    | [Pick<IMember, '_id' | 'email' | 'firstName' | 'lastName'>]
    | undefined;
}) => {
  return (
    <div>
      <div
        style={{
          display: 'flex',
          borderRight: 'solid gray 1px',
          borderLeft: 'solid gray 1px',
          borderBottom: 'solid gray 1px',
        }}
      >
        <div style={{ width: '15%', borderRight: 'solid gray 1px' }}>
          <SubTitle title="MIR #" />
          <div style={{ height: '40px' }}></div>
        </div>
        <div style={{ width: '45%', borderRight: 'solid gray 1px' }}>
          <SubTitle title="ITEM DESCRIPTION" />
          <div style={{ height: '40px' }}></div>
        </div>
        <div style={{ width: '15%', borderRight: 'solid gray 1px' }}>
          <SubTitle title="QTY" />
          <div style={{ height: '40px' }}></div>
        </div>
        <div style={{ width: '25%' }}>
          <SubTitle title="COST" />
          <div style={{ height: '40px' }}></div>
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          borderBottom: 'solid gray 1px',
          borderRight: 'solid gray 1px',
          borderLeft: 'solid gray 1px',
          fontSize: '11px',
        }}
      >
        <div style={{ width: '40%', borderRight: 'solid gray 1px' }}>
          <div
            style={{
              fontSize: '11px',
              padding: '2px',
            }}
          >
            Prepared/Repaired by:
          </div>
          <div
            style={{
              fontSize: '11px',
              padding: '2px',
            }}
          >
            Main Tech :
            <u style={{ display: 'flex', justifyContent: 'center' }}>
              {user?.toUpperCase()}
            </u>
          </div>
          {coworker?.map((worker, x) => (
            <div
              key={x}
              style={{
                fontSize: '11px',
                padding: '2px',
              }}
            >
              Tech {x + 1} :
              <u
                style={{ display: 'flex', justifyContent: 'center' }}
              >{`${worker.firstName?.toUpperCase()} ${worker.lastName?.toUpperCase()}`}</u>
            </div>
          ))}

          <div
            style={{
              fontSize: '11px',
              padding: '2px',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            Signature Over Printed Name/Date
          </div>
        </div>
        <div style={{ width: '80%', display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              padding: '5px',
              display: 'flex',
              borderBottom: 'solid gray 1px',
            }}
          >
            <div style={{ width: '60%' }}>
              <div>
                Received the above equipment/s and/or service/s in good
                condition and working properly:
              </div>
              <div
                style={{
                  marginTop: '10px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <div>{requester?.toUpperCase()}</div>
                <div>________________________________________</div>
                <div>Signature Over Printerd Name/Date</div>
              </div>
            </div>
            <div style={{ width: '40%' }}>
              <div
                style={{
                  fontSize: '12px',
                  fontWeight: 'bold',
                }}
              >
                Customer's Satisfaction
              </div>
              <div style={{ fontSize: '11px', paddingLeft: '5px' }}>
                <TickComponent
                  tick={false}
                  justify="flex-start"
                  title="Excellent"
                />
                <TickComponent
                  tick={false}
                  justify="flex-start"
                  title="Very Good"
                />
                <TickComponent tick={false} justify="flex-start" title="Good" />
                <TickComponent tick={false} justify="flex-start" title="Poor" />
              </div>
            </div>
          </div>
          <div style={{ padding: '5px' }}>
            <div>Comments/Suggestions:</div>
            <div style={{ height: '20px' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Footer = ({
  ticketNumber,
  createdBy,
  closedBy,
}: {
  ticketNumber: string | undefined;
  createdBy: string | undefined;
  closedBy: string | undefined;
}) => {
  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          fontSize: '11px',
          borderBottom: 'solid gray 1px',
          borderRight: 'solid gray 1px',
          borderLeft: 'solid gray 1px',
        }}
      >
        FOR DATA AND ADMIN USE ONLY
      </div>
      <div
        style={{
          display: 'flex',
          borderBottom: 'solid gray 1px',
          borderRight: 'solid gray 1px',
          borderLeft: 'solid gray 1px',
          fontSize: '11px',
        }}
      >
        <div style={{ width: '50%', borderRight: 'solid gray 1px' }}>
          <div style={{ paddingLeft: '5px' }}>RECEIVED BY:</div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <div>{createdBy?.toUpperCase()}</div>
            <div>____________________________________________</div>
            <div>Signature Over Printer Name/Date</div>
          </div>
        </div>
        <div style={{ width: '50%' }}>
          <div style={{ paddingLeft: '5px' }}>CLOSED BY:</div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <div>{closedBy?.toUpperCase()}</div>
            <div>____________________________________________</div>
            <div>Signature Over Printer Name/Date</div>
          </div>
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          borderBottom: 'solid gray 1px',
          borderRight: 'solid gray 1px',
          borderLeft: 'solid gray 1px',
          justifyContent: 'space-between',
          fontSize: '11px',
        }}
      >
        <div>Request Id: 781923912023f</div>
        <div>Official Ticket: #{ticketNumber}</div>
        <div>MS-FRM-19-001</div>
      </div>
    </div>
  );
};
