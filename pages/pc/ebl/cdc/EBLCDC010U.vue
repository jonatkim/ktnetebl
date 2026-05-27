<template>
  <div class="ebl-page-container">
    <EblPageHeader v-bind="pageInfo">
      <template #util>
        <EblBtn color="danger" large @click="onDelete">Delete</EblBtn>
        <EblBtn large @click="onSave">Save</EblBtn>
        <EblBtn color="cta" large @click="onIssue">Issue</EblBtn>
      </template>
    </EblPageHeader>

    <div class="ebl-card-container mb-3">
      <EblSubHeader small>
        <h2>Recipient</h2>
      </EblSubHeader>
      <!-- no="HDMUSELM70328426"
        :badges="[
          { value: 'ISSUED', color: 'mint', icon: 'ebli:document' },
          { value: 'ISSUE', icon: 'ebli:check-circle' },
        ]" -->
      <EblRecipientCombo
        v-model="recipientSearchQuery"
        :selected-item="blDocument.blRecipient"
        :recent-items="recipientRecentItems"
        placeholder="Search recipient"
        @select="onSelectRecipientCombo"
        @append-click="openRecipientDialog(recipientSearchQuery)"
        @enter-search="openRecipientDialog"
      />
    </div>
    <div class="ebl-card-container">
      <EblSubHeader>
        <h2>eBL Required information</h2>
        <template #util>
          <EblBtn color="tertiary" @click="openContainerDialog">
            <div class="d-flex align-center ga-2">
              Container
              <EblBadge pill variant="tonal" color="blue" size="sm" class="btn-badge">{{
                containerList.length
              }}</EblBadge>
            </div>
          </EblBtn>
          <EblBtn color="tertiary" @click="openTermsDialog"> Register T&C </EblBtn>
        </template>
      </EblSubHeader>
      <VDivider class="mb-3" />
      <div class="ebl-card-solid create-bl">
        <table class="ebl-paper-table">
          <colgroup>
            <col class="ebl-paper-table__col ebl-paper-table__col--left" />
            <col class="ebl-paper-table__col ebl-paper-table__col--right" />
          </colgroup>
          <tbody>
            <tr>
              <td class="ebl-paper-table__cell ebl-paper-table__cell--hero" rowspan="3">
                <div class="ebl-paper-table__hero">
                  <div class="ebl-paper-table__title">BILL OF LADING</div>
                  <div class="ebl-paper-table__logo-slot">
                    <VImg src="~/assets/images/common/ci/HMM.png" alt="Company Logo" contain />
                  </div>
                  <EblInfo vertical class="ebl-paper-table__info">
                    <EblInfoItem label="Carrier" required has-input>
                      <div class="ebl-paper-table__stack">
                        <EblInput v-model="blDocument.carrierName" />
                        <EblInput v-model="blDocument.carrierAddress" />
                      </div>
                    </EblInfoItem>
                    <EblInfoItem label="B/L No" required has-input>
                      <EblInput v-model="blDocument.blNo" />
                    </EblInfoItem>
                    <EblInfoItem label="Booking No" required has-input>
                      <EblInput v-model="blDocument.bookingNo" />
                    </EblInfoItem>
                  </EblInfo>
                </div>
              </td>
              <td class="ebl-paper-table__cell">
                <EblInfo vertical class="ebl-paper-table__info">
                  <EblInfoItem label="Shipper (Company Name/Address)" required has-input>
                    <div class="ebl-paper-table__stack">
                      <EblInput v-model="blDocument.shipperName" />
                      <EblInput v-model="blDocument.shipperAddress" />
                    </div>
                  </EblInfoItem>
                </EblInfo>
              </td>
            </tr>
            <tr>
              <td class="ebl-paper-table__cell border-left">
                <EblInfo vertical class="ebl-paper-table__info">
                  <EblInfoItem label="Consignee (Company Name/Address)" required has-input>
                    <div class="ebl-paper-table__stack">
                      <EblInput v-model="blDocument.consigneeName" />
                      <EblInput v-model="blDocument.consigneeAddress" />
                    </div>
                  </EblInfoItem>
                </EblInfo>
              </td>
            </tr>
            <tr>
              <td class="ebl-paper-table__cell border-left">
                <EblInfo vertical class="ebl-paper-table__info">
                  <EblInfoItem label="Notify Party (Company Name/Address)" required has-input>
                    <div class="ebl-paper-table__stack">
                      <EblInput v-model="blDocument.notifyParty1Name" />
                      <EblInput v-model="blDocument.notifyParty1Address" />
                    </div>
                  </EblInfoItem>
                  <EblInfoItem label="Notify Party (Company Name/Address)" has-input>
                    <div class="ebl-paper-table__stack">
                      <EblInput v-model="blDocument.notifyParty2Name" />
                      <EblInput v-model="blDocument.notifyParty2Address" />
                    </div>
                  </EblInfoItem>
                  <EblInfoItem label="Notify Party (Company Name/Address)" has-input>
                    <div class="ebl-paper-table__stack">
                      <EblInput v-model="blDocument.notifyParty3Name" />
                      <EblInput v-model="blDocument.notifyParty3Address" />
                    </div>
                  </EblInfoItem>
                </EblInfo>
              </td>
            </tr>
            <tr>
              <td class="ebl-paper-table__cell">
                <EblInfo vertical class="ebl-paper-table__info">
                  <EblInfoItem label="B/L Type" required has-input>
                    <EblSelect v-model="blDocument.blType" :options="blTypeOptions" />
                  </EblInfoItem>
                </EblInfo>
              </td>
              <td class="ebl-paper-table__cell">
                <EblInfo vertical class="ebl-paper-table__info">
                  <EblInfoItem label="Freight Term" required has-input>
                    <EblSelect v-model="blDocument.freightTerm" :options="freightTermOptions" />
                  </EblInfoItem>
                </EblInfo>
              </td>
            </tr>

            <tr>
              <td class="ebl-paper-table__cell">
                <EblInfo vertical class="ebl-paper-table__info">
                  <EblInfoItem label="Vessel" required has-input>
                    <EblInput v-model="blDocument.vessel" />
                  </EblInfoItem>
                </EblInfo>
              </td>
              <td class="ebl-paper-table__cell">
                <EblInfo vertical class="ebl-paper-table__info">
                  <EblInfoItem label="Voyage" required has-input>
                    <EblInput v-model="blDocument.voyage" />
                  </EblInfoItem>
                </EblInfo>
              </td>
            </tr>

            <tr>
              <td class="ebl-paper-table__cell">
                <EblInfo vertical class="ebl-paper-table__info">
                  <EblInfoItem label="From Service Term" required has-input>
                    <EblSelect v-model="blDocument.fromServiceTerm" :options="serviceTermOptions" />
                  </EblInfoItem>
                </EblInfo>
              </td>
              <td class="ebl-paper-table__cell">
                <EblInfo vertical class="ebl-paper-table__info">
                  <EblInfoItem label="To Service Term" required has-input>
                    <EblSelect v-model="blDocument.toServiceTerm" :options="serviceTermOptions" />
                  </EblInfoItem>
                </EblInfo>
              </td>
            </tr>

            <tr>
              <td class="ebl-paper-table__cell">
                <EblInfo vertical class="ebl-paper-table__info">
                  <EblInfoItem label="Planned Departure Date" required has-input>
                    <EblDatePicker v-model="blDocument.plannedDepartureDate" />
                  </EblInfoItem>
                </EblInfo>
              </td>
              <td class="ebl-paper-table__cell">
                <EblInfo vertical class="ebl-paper-table__info">
                  <EblInfoItem label="Planned Arrival Date" required has-input>
                    <EblDatePicker v-model="blDocument.plannedArrivalDate" />
                  </EblInfoItem>
                </EblInfo>
              </td>
            </tr>

            <tr>
              <td class="ebl-paper-table__cell">
                <EblInfo vertical class="ebl-paper-table__info">
                  <EblInfoItem label="Place of Receipt" required has-input>
                    <EblSelect v-model="blDocument.placeOfReceipt" :options="locationOptions" />
                  </EblInfoItem>
                </EblInfo>
              </td>
              <td class="ebl-paper-table__cell">
                <EblInfo vertical class="ebl-paper-table__info">
                  <EblInfoItem label="Port of Load" required has-input>
                    <EblSelect v-model="blDocument.portOfLoad" :options="locationOptions" />
                  </EblInfoItem>
                </EblInfo>
              </td>
            </tr>

            <tr>
              <td class="ebl-paper-table__cell">
                <EblInfo vertical class="ebl-paper-table__info">
                  <EblInfoItem label="Port of Discharge" required has-input>
                    <EblSelect v-model="blDocument.portOfDischarge" :options="locationOptions" />
                  </EblInfoItem>
                </EblInfo>
              </td>
              <td class="ebl-paper-table__cell">
                <EblInfo vertical class="ebl-paper-table__info">
                  <EblInfoItem label="Place of Delivery" required has-input>
                    <EblSelect v-model="blDocument.placeOfDelivery" :options="locationOptions" />
                  </EblInfoItem>
                </EblInfo>
              </td>
            </tr>

            <tr>
              <td class="ebl-paper-table__cell ebl-paper-table__cell--section" colspan="2">
                <div class="ebl-paper-table__section-title">
                  Particulars Furnished by Consignor/Shipper
                </div>
              </td>
            </tr>

            <tr>
              <td class="ebl-paper-table__cell pa-0" colspan="2">
                <div class="ebl-paper-table__grid-3">
                  <EblInfo vertical class="ebl-paper-table__info ebl-paper-table__col">
                    <EblInfoItem label="Origin Cargo Type" required has-input>
                      <EblInput v-model="blDocument.originCargoType" />
                    </EblInfoItem>
                  </EblInfo>
                  <EblInfo vertical class="ebl-paper-table__info ebl-paper-table__col">
                    <EblInfoItem label="Destination Cargo Type" required has-input>
                      <EblSelect
                        v-model="blDocument.destinationCargoType"
                        :options="cargoTypeOptions"
                      />
                    </EblInfoItem>
                  </EblInfo>
                  <EblInfo vertical class="ebl-paper-table__info ebl-paper-table__col">
                    <EblInfoItem label="HS Code" required has-input>
                      <EblSelect v-model="blDocument.hsCode" :options="hsCodeOptions" />
                    </EblInfoItem>
                  </EblInfo>
                </div>
              </td>
            </tr>

            <tr>
              <td class="ebl-paper-table__cell pa-0" colspan="2">
                <div class="ebl-paper-table__grid-3">
                  <EblInfo vertical class="ebl-paper-table__info ebl-paper-table__col">
                    <EblInfoItem label="Total Weight / UNIT" required has-input>
                      <div class="ebl-paper-table__inline">
                        <EblInput v-model="blDocument.totalWeight" />
                        <EblSelect
                          v-model="blDocument.totalWeightUnit"
                          :options="weightUnitOptions"
                        />
                      </div>
                    </EblInfoItem>
                  </EblInfo>
                  <EblInfo vertical class="ebl-paper-table__info ebl-paper-table__col">
                    <EblInfoItem label="Total Volume / UNIT" required has-input>
                      <div class="ebl-paper-table__inline">
                        <EblInput v-model="blDocument.totalVolume" />
                        <EblSelect
                          v-model="blDocument.totalVolumeUnit"
                          :options="volumeUnitOptions"
                        />
                      </div>
                    </EblInfoItem>
                  </EblInfo>
                  <EblInfo vertical class="ebl-paper-table__info ebl-paper-table__col">
                    <EblInfoItem label="Total Package / UNIT" required has-input>
                      <div class="ebl-paper-table__inline">
                        <EblInput v-model="blDocument.totalPackage" />
                        <EblSelect
                          v-model="blDocument.totalPackageUnit"
                          :options="weightUnitOptions"
                        />
                      </div>
                    </EblInfoItem>
                  </EblInfo>
                </div>
              </td>
            </tr>

            <tr>
              <td class="ebl-paper-table__cell" colspan="2">
                <EblInfo vertical class="ebl-paper-table__info">
                  <EblInfoItem label="Description of Goods" required has-input>
                    <EblTextarea v-model="blDocument.descriptionOfGoods" :counter="500" :rows="5" />
                  </EblInfoItem>
                </EblInfo>
              </td>
            </tr>

            <tr>
              <td class="ebl-paper-table__cell">
                <EblInfo vertical class="ebl-paper-table__info">
                  <EblInfoItem label="Issued Place" required has-input>
                    <EblSelect
                      v-model="blDocument.issuedPlace"
                      combobox
                      filter-mode="startsWith"
                      :options="locationOptions"
                      @enter="appendLocationOption"
                    >
                      <template #no-result="{ query }">
                        <strong>"{{ query }}"</strong>으로 시작하는 항목이 없습니다.<br />
                        <kbd>enter</kbd>를 눌러 새 항목을 추가하세요
                      </template>
                    </EblSelect>
                  </EblInfoItem>
                </EblInfo>
              </td>
              <td class="ebl-paper-table__cell">
                <EblInfo vertical class="ebl-paper-table__info">
                  <EblInfoItem label="Paid At" required has-input>
                    <EblSelect
                      v-model="blDocument.paidAt"
                      combobox
                      :options="locationOptions"
                      @enter="appendLocationOption"
                    >
                      <template #no-result="{ query }">
                        No results matching <strong>"{{ query }}"</strong>.<br />
                        Press <kbd>enter</kbd> to create a new one
                      </template>
                    </EblSelect>
                  </EblInfoItem>
                </EblInfo>
              </td>
            </tr>

            <tr>
              <td class="ebl-paper-table__cell">
                <EblInfo vertical class="ebl-paper-table__info">
                  <EblInfoItem label="Issue Date" required has-input>
                    <EblDatePicker v-model="blDocument.issueDate" />
                  </EblInfoItem>
                </EblInfo>
              </td>
              <td class="ebl-paper-table__cell">
                <EblInfo vertical class="ebl-paper-table__info">
                  <EblInfoItem label="On Board Date" required has-input>
                    <EblDatePicker v-model="blDocument.onBoardDate" />
                  </EblInfoItem>
                </EblInfo>
              </td>
            </tr>

            <tr>
              <td class="ebl-paper-table__cell">
                <EblInfo vertical class="ebl-paper-table__info">
                  <EblInfoItem label="IsToOrder" required has-input>
                    <EblSelect v-model="blDocument.isToOrder" :options="isToOrderOptions" />
                  </EblInfoItem>
                </EblInfo>
              </td>
              <td class="ebl-paper-table__cell">
                <EblInfo vertical class="ebl-paper-table__info">
                  <EblInfoItem label="Endorsement Type" required has-input>
                    <EblSelect
                      v-model="blDocument.endorsementType"
                      :options="endorsementTypeOptions"
                    />
                  </EblInfoItem>
                </EblInfo>
              </td>
            </tr>

            <tr>
              <td class="ebl-paper-table__cell" colspan="2">
                <EblInfo vertical class="ebl-paper-table__info">
                  <EblInfoItem label="Endorsee" required has-input>
                    <EblRecipientCombo
                      v-model="endorseeSearchQuery"
                      :selected-item="blDocument.endorseeRecipient"
                      :recent-items="recipientRecentItems"
                      :disabled="blDocument.isToOrder !== 'Y'"
                      small
                      placeholder="Search endorsee"
                      @select="onSelectEndorseeCombo"
                      @append-click="openEndorseeDialog(endorseeSearchQuery)"
                      @enter-search="openEndorseeDialog"
                    />
                  </EblInfoItem>
                </EblInfo>
              </td>
            </tr>

            <tr>
              <td class="ebl-paper-table__cell" colspan="2">
                <EblInfo vertical class="ebl-paper-table__info">
                  <EblInfoItem label="Signature" required has-input>
                    <EblFileInput
                      v-model="blDocument.signatureFiles"
                      placeholder="Click here to upload your file or drag."
                      help-text="PDF, JPEG, PNG (50MB max)"
                    />
                  </EblInfoItem>
                </EblInfo>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <EblDialog
      v-model="containerDialogOpen"
      transition="slide-x-reverse-transition"
      content-class="ebl-dialog fill-height"
      @close="closeContainerDialog"
    >
      <VCard width="960" class="ebl-dialog__card">
        <VCardTitle class="ebl-dialog__header">
          <span class="title">Container</span>
          <VSpacer />
          <EblBtn icon pill small @click="closeContainerDialog">
            <VIcon icon="ebli:close" :size="20" />
          </EblBtn>
        </VCardTitle>

        <VCardText class="ebl-dialog__text overflow-y-auto">
          <div class="ebl-card-linear d-flex" style="height: 640px">
            <EblContainerList
              ref="containerListRef"
              v-model="selectedContainer"
              :list="containerList"
              class="border-right"
              style="width: 310px"
            >
              <template #util>
                <VSpacer />
                <EblBtn icon="ebli:trash-can" color="danger" class="mr-2"></EblBtn>
                <EblBtn outlined icon="ebli:plus" @click="addContainer"></EblBtn>
              </template>
              <template #item="{ item }">
                <div class="ebl-container-list__item-no">{{ getContainerListLabel(item) }}</div>
              </template>
            </EblContainerList>
            <div class="ebl-container-contents flex-1">
              <div class="ebl-container-contents__util">
                <VSpacer />
                <EblBtn color="danger" @click="resetContainerForm">Reset</EblBtn>
                <EblBtn outlined prepend-icon="ebli:upload">Upload</EblBtn>
              </div>
              <!-- selectedContainer 선택한 값의 내용이 인풋으로 배치됨 -->
              <template v-if="selectedContainer">
                <EblInfo vertical>
                  <EblInfoItem label="Container No" required has-input>
                    <EblInput ref="containerNoInputRef" v-model="selectedContainer.containerNo" />
                  </EblInfoItem>
                  <EblInfoItem label="Seal No" required has-input>
                    <EblInput v-model="selectedContainer.sealNo" />
                  </EblInfoItem>

                  <div class="row">
                    <div class="col">
                      <EblInfoItem label="Size / Type" required has-input>
                        <EblSelect
                          v-model="selectedContainer.sizeType"
                          :options="sizeTypeOptions"
                        />
                      </EblInfoItem>
                    </div>
                    <div class="col">
                      <EblInfoItem label="PKG/Unit" required has-input>
                        <div class="ebl-paper-table__inline">
                          <EblInput v-model="selectedContainer.pkgQty" />
                          <EblSelect
                            v-model="selectedContainer.pkgUnit"
                            :options="pkgUnitOptions"
                          />
                        </div>
                      </EblInfoItem>
                    </div>
                  </div>

                  <div class="row">
                    <div class="col">
                      <EblInfoItem label="Gross Weight" required has-input>
                        <div class="inline">
                          <EblInput v-model="selectedContainer.grossWeight" />
                          <EblSelect
                            v-model="selectedContainer.grossWeightUnit"
                            :options="weightUnitOptions"
                          />
                        </div>
                      </EblInfoItem>
                    </div>
                    <div class="col">
                      <EblInfoItem label="Tare" required has-input>
                        <div class="inline">
                          <EblInput v-model="selectedContainer.tare" />
                          <EblSelect
                            v-model="selectedContainer.tareUnit"
                            :options="weightUnitOptions"
                          />
                        </div>
                      </EblInfoItem>
                    </div>
                  </div>

                  <div class="row">
                    <div class="col">
                      <EblInfoItem label="VGM" required has-input>
                        <EblInput v-model="selectedContainer.vgm" />
                      </EblInfoItem>
                    </div>
                    <div class="col">
                      <EblInfoItem label="Volume / Unit" required has-input>
                        <div class="inline">
                          <EblInput v-model="selectedContainer.volume" />
                          <EblSelect
                            v-model="selectedContainer.volumeUnit"
                            :options="volumeUnitOptions"
                          />
                        </div>
                      </EblInfoItem>
                    </div>
                  </div>

                  <div class="row">
                    <div class="col">
                      <EblInfoItem label="S/C" required has-input>
                        <EblSelect v-model="selectedContainer.sc" :options="scOptions" />
                      </EblInfoItem>
                    </div>
                    <div class="col">
                      <EblInfoItem label="RF" required has-input>
                        <EblSelect v-model="selectedContainer.rf" :options="rfOptions" />
                      </EblInfoItem>
                    </div>
                  </div>

                  <EblInfoItem label="Temp / Unit" required has-input>
                    <div class="ebl-paper-table__inline">
                      <EblInput
                        v-model="selectedContainer.temp"
                        :disabled="selectedContainer.rf !== 'Y'"
                      />
                      <EblSelect
                        v-model="selectedContainer.tempUnit"
                        :options="tempUnitOptions"
                        :disabled="selectedContainer.rf !== 'Y'"
                      />
                    </div>
                  </EblInfoItem>

                  <div class="row">
                    <div class="col">
                      <EblInfoItem label="DG Name" required has-input>
                        <EblInput v-model="selectedContainer.dgName" />
                      </EblInfoItem>
                    </div>
                    <div class="col">
                      <EblInfoItem label="IMDG" required has-input>
                        <EblInput v-model="selectedContainer.imdg" />
                      </EblInfoItem>
                    </div>
                  </div>
                </EblInfo>
              </template>
              <template v-else>
                <div class="text-center py-5" style="color: var(--text-subtle); padding-top: 150px">
                  Select a container to view details
                </div>
              </template>
            </div>
          </div>
        </VCardText>

        <VCardActions class="ebl-dialog__footer">
          <VSpacer />
          <EblBtn large @click="closeContainerDialog">Cancel</EblBtn>
          <EblBtn color="cta" large>Save</EblBtn>
        </VCardActions>
      </VCard>
    </EblDialog>

    <EblDialog
      v-model="termsDialogOpen"
      transition="slide-x-reverse-transition"
      content-class="ebl-dialog fill-height"
      @close="closeTermsDialog"
    >
      <VCard width="960" class="ebl-dialog__card">
        <VCardTitle class="ebl-dialog__header">
          <span class="title">Terms &amp; Conditions</span>
          <VSpacer />
          <EblBtn icon pill small @click="closeTermsDialog">
            <VIcon icon="ebli:close" :size="20" />
          </EblBtn>
        </VCardTitle>

        <VCardText class="ebl-dialog__text overflow-y-auto">
          <div class="ebl-terms-list mb-6">
            <div v-for="term in termsData" :key="term.title" class="ebl-terms-list__item">
              <div class="ebl-terms-list__title">{{ term.title }}</div>
              <div class="ebl-terms-list__text">{{ term.description }}</div>
            </div>
          </div>
          <EblInfo vertical>
            <EblInfoItem label="Additional T&C" has-input>
              <EblTextarea
                v-model="additionalTC"
                :rows="6"
                :maxlength="5000"
                counter
                placeholder="텍스트를 입력하세요"
              />
            </EblInfoItem>
            <EblInfoItem label="Additional Comment" has-input>
              <EblTextarea
                v-model="additionalComment"
                :rows="6"
                :maxlength="5000"
                counter
                placeholder="텍스트를 입력하세요"
              />
            </EblInfoItem>
          </EblInfo>
        </VCardText>

        <VCardActions class="ebl-dialog__footer">
          <EblBtn color="danger" large @click="resetTermsForm">Reset</EblBtn>
          <VSpacer />
          <EblBtn large @click="closeTermsDialog">Cancel</EblBtn>
          <EblBtn color="cta" large @click="saveTermsDialog">Save</EblBtn>
        </VCardActions>
      </VCard>
    </EblDialog>

    <EblDialog
      v-model="issuePasswordDialogOpen"
      content-class="ebl-dialog ebl-dialog--center"
      @close="closeIssuePasswordDialog"
    >
      <VCard width="400" class="ebl-dialog__card">
        <VCardTitle class="ebl-dialog__header">
          <span class="title">Enter Password</span>
          <VSpacer />
          <EblBtn icon pill small @click="closeIssuePasswordDialog">
            <VIcon icon="ebli:close" :size="20" />
          </EblBtn>
        </VCardTitle>

        <VCardText class="ebl-dialog__text">
          <EblInfo vertical>
            <EblInfoItem label="User Password" has-input>
              <EblInput
                v-model="issuePassword"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Enter your password"
                :error-message="issuePasswordError"
                @input="clearIssuePasswordError"
              >
                <template #append>
                  <EblBtn
                    :icon="showPassword ? 'ebli:eye-open' : 'ebli:eye-close'"
                    small
                    color="ghost"
                    @click="showPassword = !showPassword"
                  />
                </template>
              </EblInput>
            </EblInfoItem>
          </EblInfo>
        </VCardText>

        <VCardActions class="ebl-dialog__footer">
          <VSpacer />
          <EblBtn large @click="closeIssuePasswordDialog">Cancel</EblBtn>
          <EblBtn color="cta" large @click="checkIssuePassword">Check</EblBtn>
        </VCardActions>
      </VCard>
    </EblDialog>

    <EblDialog
      v-model="recipientSelectDialogOpen"
      transition="slide-x-reverse-transition"
      content-class="ebl-dialog fill-height"
      @close="closeRecipientDialog"
    >
      <VCard width="800" class="ebl-dialog__card ebl-bl-select">
        <VCardTitle class="ebl-dialog__header">
          <span class="title">Recipient</span>
          <VSpacer />
          <EblBtn icon pill small @click="closeRecipientDialog">
            <VIcon icon="ebli:close" :size="20" />
          </EblBtn>
        </VCardTitle>

        <VCardText class="ebl-dialog__text overflow-y-auto">
          <div class="ebl-bl-select__top">
            <div class="ebl-bl-select__total">
              Total <strong>{{ filteredRecipientItems.length }}</strong>
            </div>
            <div class="ebl-bl-select__filters">
              <EblSelect
                v-model="recipientSelectFilters.key"
                :options="recipientSelectFilterOptions"
                class="ebl-bl-select__filter"
              />
              <EblInput
                v-model="recipientSelectFilters.query"
                prepend-icon="ebli:search"
                placeholder="Placeholder"
              />
            </div>
          </div>

          <div class="ebl-bl-select__table-wrap">
            <AgGridVue
              class="ebl-data-grid ag-theme-quartz"
              :row-data="pagedRecipientItems"
              :column-defs="recipientSelectColDefs"
              :row-selection="recipientSelectRowSelection"
              :dom-layout="'autoHeight'"
              @grid-ready="onRecipientGridReady"
              @selection-changed="onRecipientSelectionChanged"
            />
          </div>

          <div class="ebl-bl-select__pagination">
            <EblPagination
              v-model="recipientSelectPage"
              :length="Math.ceil(filteredRecipientItems.length / recipientSelectPerPage) || 1"
              total-visible="7"
              show-first-last-page
            />
          </div>
        </VCardText>

        <VCardActions class="ebl-dialog__footer">
          <VSpacer />
          <EblBtn large @click="closeRecipientDialog">Cancel</EblBtn>
          <EblBtn color="cta" large @click="confirmRecipientSelection">Select</EblBtn>
        </VCardActions>
      </VCard>
    </EblDialog>
  </div>
</template>

<script setup>
import { AgGridVue } from 'ag-grid-vue3'
import CompanyNameCellRenderer from '~/components/grid/CompanyNameCellRenderer.vue'
import { useToastStore } from '~/stores/toast'
import { useDialogStore } from '~/stores/useDialogStore'

const router = useRouter()

const dialogStore = useDialogStore()
// 페이지 정보
const pageInfo = ref({
  title: 'Create B/L',
  breadcrumbItems: [{ text: 'Menu' }, { text: 'Documents' }, { text: 'Create B/L' }],
})

const toastStore = useToastStore()

const blDocument = ref({
  blRecipient: {
    name: '',
    address: '',
    logo: '',
  },
  shipperName: '',
  shipperAddress: '',
  consigneeName: '',
  consigneeAddress: '',
  notifyParty1Name: '',
  notifyParty1Address: '',
  notifyParty2Name: '',
  notifyParty2Address: '',
  notifyParty3Name: '',
  notifyParty3Address: '',
  carrierName: '',
  carrierAddress: '',
  blNo: '',
  bookingNo: '',
  blType: null,
  freightTerm: null,
  vessel: '',
  voyage: '',
  fromServiceTerm: null,
  toServiceTerm: null,
  plannedDepartureDate: null,
  plannedArrivalDate: null,
  placeOfReceipt: null,
  portOfLoad: null,
  portOfDischarge: null,
  placeOfDelivery: null,
  originCargoType: null,
  destinationCargoType: null,
  hsCode: null,
  totalWeight: '',
  totalWeightUnit: null,
  totalVolume: '',
  totalVolumeUnit: null,
  totalPackage: '',
  totalPackageUnit: null,
  descriptionOfGoods: '',
  issuedPlace: null,
  paidAt: null,
  issueDate: null,
  onBoardDate: null,
  isToOrder: null,
  endorsementType: null,
  endorsee: '',
  endorseeRecipient: {
    name: '',
    address: '',
    logo: '',
  },
  signatureFiles: [],
})

const recipientSelectDialogOpen = ref(false)
const containerDialogOpen = ref(false)
const termsDialogOpen = ref(false)
const issuePasswordDialogOpen = ref(false)
const issuePassword = ref('')
const showPassword = ref(false)
const issuePasswordError = ref('')
const issuePasswordToggle = ref(false)
const selectedContainer = ref(null)
const containerListRef = ref(null)
const containerNoInputRef = ref(null)
const recipientSelectTarget = ref('blRecipient')
const recipientSelectFilters = ref({
  key: 'companyName',
  query: '',
})
const recipientSelectFilterOptions = [
  { label: 'Company Name', value: 'companyName' },
  { label: 'Owner', value: 'owner' },
  { label: 'DUNS No', value: 'dunsNo' },
  { label: 'MID', value: 'mid' },
]
const recipientSelectPage = ref(1)
const recipientSelectPerPage = ref(10) //2026.05.18 recipient list 갯수 증가 8 -> 10
const selectedRecipientId = ref(null)
const recipientSearchQuery = ref('')
const endorseeSearchQuery = ref('')
const recipientBaseItem = {
  companyName: 'KTNETEBL',
  country: 'KR',
  owner: 'Gil-Dong Hong',
  dunsNo: '123456789',
  mid: 'user1@ktnet.co.kr',
  companyAddress: '338, Pangyo-ro, Bundang-gu, Seongnam-si, Gyeonggi-do, KR',
  companyLogo: 'https://i.pravatar.cc/150?img=11',
}

const recipientCompanyNames = [
  'KTNETEBL',
  'CJ Logistics',
  'Hana Bank',
  'HMM',
  'Maersk',
  'CMA CGM',
  'ONE',
  'MSC',
  'Evergreen',
  'COSCO',
]

const recipientOwners = [
  'Gil-Dong Hong',
  'Kevin Brown',
  'James Park',
  'Soo-Min Lee',
  'Anna Schmidt',
  'Marco Rossi',
  'Lars Jensen',
  'Wei Chen',
  'Min-Ho Chen',
  'Noam Cohen',
]

const recipientCountries = ['KR', 'US', 'CN', 'JP', 'SG', 'DE', 'FR', 'DK', 'TW', 'HK']

const recipientAddresses = [
  '338, Pangyo-ro, Bundang-gu, Seongnam-si, Gyeonggi-do, KR',
  '1750 S Wolf Rd, Des Plaines, IL 60018, US',
  '66, Eulji-ro, Jung-gu, Seoul, KR',
  'Esplanaden 50, 1263 Copenhagen, DK',
  '4 Quai d Arenc, 13002 Marseille, FR',
  'Shibaura, Minato-ku, Tokyo, JP',
  'Chemin Rieu 12-14, 1208 Geneva, CH',
  'No. 1, Sec. 2, Zhongshan N. Rd., Taipei, TW',
  'No. 378 Dong Da Ming Road, Shanghai, CN',
  'Harbour Centre, 25 Harbour Road, HK',
]

const recipientSelectItems = ref(
  Array.from({ length: 30 }, (_, index) => {
    const nameIndex = (index * 3) % recipientCompanyNames.length
    const ownerIndex = (index * 5) % recipientOwners.length
    const countryIndex = (index * 7) % recipientCountries.length
    const addressIndex = (index * 11) % recipientAddresses.length
    const dunsNumber = 100000000 + (((index + 1) * 7919) % 900000000)

    return {
      ...recipientBaseItem,
      id: index + 1,
      companyName: `${recipientCompanyNames[nameIndex]} ${index + 1}`,
      country: recipientCountries[countryIndex],
      owner: recipientOwners[ownerIndex],
      dunsNo: String(dunsNumber),
      mid: `user${index + 1}@example.com`,
      companyAddress: recipientAddresses[addressIndex],
      companyLogo: `https://i.pravatar.cc/150?img=${11 + (index % 30)}`,
    }
  }),
)

// 최근 수령인/선택 결과 모두 같은 표시 포맷으로 맞춘다.
const toRecipientComboItem = (item) => ({
  id: item.id,
  name: item.companyName,
  address: item.companyAddress,
  logo: item.companyLogo,
  mid: item.mid,
})

// 퍼블 예시에서는 최근 이용 수령인 목록만 별도 더미 5개(임시, 추후 로컬스토리지? 쿠키)로 유지한다.
const recipientRecentItems = ref(recipientSelectItems.value.slice(0, 5).map(toRecipientComboItem))

const prependRecentRecipient = (selected) => {
  const nextRecentItem = toRecipientComboItem(selected)

  recipientRecentItems.value = [
    nextRecentItem,
    ...recipientRecentItems.value.filter((item) => item.id !== selected.id),
  ]
}

const filteredRecipientItems = computed(() => {
  const query = recipientSelectFilters.value.query.trim().toLowerCase()
  if (!query) return recipientSelectItems.value
  const key = recipientSelectFilters.value.key
  return recipientSelectItems.value.filter((item) =>
    String(item[key] || '')
      .toLowerCase()
      .includes(query),
  )
})

const pagedRecipientItems = computed(() => {
  const start = (recipientSelectPage.value - 1) * recipientSelectPerPage.value
  return filteredRecipientItems.value.slice(start, start + recipientSelectPerPage.value)
})

const recipientSelectRowSelection = {
  mode: 'singleRow',
  checkboxes: false,
  enableClickSelection: true,
}

const recipientSelectGridApi = ref(null)

const recipientSelectColDefs = ref([
  {
    headerName: 'Company Name',
    field: 'companyName',
    flex: 1,
    minWidth: 220,
    cellStyle: {
      display: 'flex',
      alignItems: 'center',
    },
    cellRenderer: CompanyNameCellRenderer,
    cellRendererParams: (params) => ({
      name: params.data?.companyName || '',
      logo: params.data?.companyLogo || '',
      prefix: params.data?.country || '',
      showSelector: true,
    }),
    headerStyle: { justifyContent: 'flex-start' },
  },
  {
    headerName: 'Owner',
    field: 'owner',
    width: 160,
    minWidth: 140,
    headerStyle: { justifyContent: 'flex-start' },
  },
  {
    headerName: 'DUNS No',
    field: 'dunsNo',
    width: 140,
    minWidth: 120,
    headerStyle: { justifyContent: 'flex-start' },
  },
  {
    headerName: 'MID',
    field: 'mid',
    width: 180,
    minWidth: 160,
    headerStyle: { justifyContent: 'flex-start' },
  },
])

const onRecipientGridReady = (params) => {
  recipientSelectGridApi.value = params.api
}

const onRecipientSelectionChanged = () => {
  const selected = recipientSelectGridApi.value?.getSelectedRows()
  selectedRecipientId.value = selected?.[0]?.id || null
}

// 다이얼로그는 target/query/current recipient만 받아 공통 로직으로 연다.
const openRecipientSelectionDialog = (target, query = '', currentRecipient = null) => {
  recipientSelectDialogOpen.value = true
  recipientSelectTarget.value = target
  recipientSelectFilters.value.key = 'companyName'
  recipientSelectFilters.value.query = query
  recipientSelectPage.value = 1

  const match = recipientSelectItems.value.find(
    (item) => item.companyName === currentRecipient?.name,
  )
  selectedRecipientId.value = match ? match.id : selectedRecipientId.value
}

const openRecipientDialog = (query = '') => {
  openRecipientSelectionDialog('blRecipient', query, blDocument.value.blRecipient)
}

const openEndorseeDialog = (query = '') => {
  if (blDocument.value.isToOrder !== 'Y') return
  openRecipientSelectionDialog('endorsee', query, blDocument.value.endorseeRecipient)
}

const closeRecipientDialog = () => {
  recipientSelectDialogOpen.value = false
}

// 콤보/다이얼로그 선택 결과를 문서 상태에 같은 방식으로 반영한다.
const applyRecipientSelection = (target, item) => {
  const normalizedRecipient = {
    name: item?.name || '',
    address: item?.address || '',
    logo: item?.logo || '',
  }

  if (target === 'endorsee') {
    blDocument.value.endorsee = item?.mid || ''
    blDocument.value.endorseeRecipient = normalizedRecipient
    endorseeSearchQuery.value = ''
    return
  }

  blDocument.value.blRecipient = normalizedRecipient
  recipientSearchQuery.value = ''
}

const onSelectRecipientCombo = (item) => applyRecipientSelection('blRecipient', item)

const onSelectEndorseeCombo = (item) => applyRecipientSelection('endorsee', item)

const openContainerDialog = () => {
  containerDialogOpen.value = true
}

const closeContainerDialog = () => {
  containerDialogOpen.value = false
}

const openTermsDialog = () => {
  termsDialogOpen.value = true
}

const closeTermsDialog = () => {
  termsDialogOpen.value = false
}
const saveTermsDialog = () => {
  // 작성중인 B/L데이터가 저장되었습니다.
  toastStore.add({
    text: '작성중인 B/L데이터가 저장되었습니다.',
  })
  termsDialogOpen.value = false
}

const onIssue = () => {
  // TODO: validation check
  issuePasswordDialogOpen.value = true
}

const onSave = () => {
  toastStore.add({
    text: '작성중인 B/L데이터가 저장되었습니다.',
  })
  router.push('/pc/ebl/cdc/EBLCDC060U')
}

const onDelete = async () => {
  const confirmed = await dialogStore.showConfirm({
    title: '경고',
    icon: 'warning',
    message: '작성중인 B/L을 삭제 하시겠습니까?',
    confirmText: '확인',
    cancelText: '취소',
  })
  if (!confirmed) return
}

const closeIssuePasswordDialog = () => {
  issuePasswordDialogOpen.value = false
  issuePassword.value = ''
  issuePasswordError.value = ''
  showPassword.value = false
}

const clearIssuePasswordError = () => {
  issuePasswordError.value = ''
}

const checkIssuePassword = () => {
  // 테스트용 성공/실패 토글
  issuePasswordToggle.value = !issuePasswordToggle.value
  if (issuePasswordToggle.value) {
    toastStore.add({
      text: '작성한 B/L의 발행이 정상적으로 요청되었습니다.',
    })
    closeIssuePasswordDialog()
    return
  }
  issuePasswordError.value = '비밀번호가 틀렸습니다. 다시 입력해 주세요.'
}
const getDraftContainerIndex = (targetItem) => {
  let draftIndex = 0
  for (const item of containerList.value) {
    if (!item.containerNo) {
      draftIndex += 1
    }
    if (item.id === targetItem.id) return draftIndex
  }
  return 1
}

// 빈 항목은 Draft 번호를 붙여서 여러 개가 생겨도 목록에서 구분 가능하게 한다.
const getContainerListLabel = (item) => {
  if (item.containerNo) return item.containerNo
  return `Draft Container ${getDraftContainerIndex(item)}`
}

const addContainer = async () => {
  const nextId =
    Math.max(0, ...containerList.value.map((item) => (Number.isFinite(item.id) ? item.id : 0))) + 1
  const newItem = createContainerItem(nextId)
  containerList.value.push(newItem)
  selectedContainer.value = newItem
  await nextTick()
  // 새 Draft가 목록 하단에 추가되면 바로 현재 작업 항목이 보이도록 스크롤을 맞춘다.
  await containerListRef.value?.scrollSelectedIntoView?.('center')
  containerNoInputRef.value?.focus?.()
}

const resetContainerForm = async () => {
  const confirmed = await dialogStore.showConfirm({
    title: '경고',
    icon: 'warning',
    message: '작성중인 컨테이너 정보를 삭제 하시겠습니까?',
    confirmText: '확인',
    cancelText: '취소',
  })

  if (!confirmed) return
  if (!selectedContainer.value) return
  const currentId = selectedContainer.value.id
  const resetItem = createContainerItem(currentId)
  const index = containerList.value.findIndex((item) => item.id === currentId)
  if (index >= 0) {
    containerList.value.splice(index, 1, resetItem)
  }
  selectedContainer.value = resetItem
}

const resetTermsForm = () => {
  additionalTC.value = ''
  additionalComment.value = ''
}

const confirmRecipientSelection = () => {
  const selected = recipientSelectItems.value.find((item) => item.id === selectedRecipientId.value)
  if (!selected) return

  prependRecentRecipient(selected)
  applyRecipientSelection(recipientSelectTarget.value, toRecipientComboItem(selected))
  recipientSelectDialogOpen.value = false
}

const blTypeOptions = [
  { label: 'BOL', value: 'BOL' },
  { label: 'SWB', value: 'SWB' },
]

const freightTermOptions = [
  { label: 'PRE', value: 'PRE' },
  { label: 'COL', value: 'COL' },
]

const serviceTermOptions = [
  { label: 'CY', value: 'CY' },
  { label: 'SD', value: 'SD' },
  { label: 'CFS', value: 'CFS' },
]

const locationOptions = ref([
  { label: 'KRPUS (BUSAN, KOREA)', value: 'KRPUS' },
  { label: 'USLAX (LOS ANGELES, US)', value: 'USLAX' },
  { label: 'USNYC (NEW YORK, US)', value: 'USNYC' },
])

const appendLocationOption = ({ query }) => {
  locationOptions.value.push({ label: query, value: query })
}

const cargoTypeOptions = [
  { label: 'FCL', value: 'FCL' },
  { label: 'LCL', value: 'LCL' },
]

const hsCodeOptions = [
  { label: '010121', value: '010121' },
  { label: '020130', value: '020130' },
  { label: '040221', value: '040221' },
  { label: '080390', value: '080390' },
  { label: '100630', value: '100630' },
  { label: '220300', value: '220300' },
  { label: '271019', value: '271019' },
  { label: '300490', value: '300490' },
  { label: '390761', value: '390761' },
  { label: '847130', value: '847130' },
]

const additionalTC = ref('')
const additionalComment = ref('')

const termsData = ref([
  {
    title: 'DEFINITIONS',
    description: 'When used in this Bill of Lading :',
  },
  {
    title: 'CLAUSE PARAMOUNT',
    description:
      '(A) Except as provided in (B) below, the international Convention for the Unification of...',
  },
  {
    title: "SHIPPER'S RESPONSIBILITY FOR CARGO",
    description:
      'The Shipper warrants that the goods are lawfully and properly described and packaged for safe carriage...',
  },
  {
    title: 'FREIGHT CHARGES',
    description:
      'Unless otherwise agreed in writing, all freight, charges and other monies due under this Bill of Lading...',
  },
  {
    title: 'LIEN',
    description:
      'The Carrier shall have a lien on the goods, on any documents relating to the goods and on...',
  },
  {
    title: 'LIMITATION OF LIABILITY',
    description:
      'The total liability of the Carrier under this Bill of Lading shall be limited to the actual loss or damage...',
  },
  {
    title: 'NOTICE OF LOSS OR DAMAGE',
    description:
      'Unless notice of loss or damage and the general nature of such loss or damage is given in writing...',
  },
  {
    title: 'DECK CARGO',
    description:
      'Goods on deck shall be carried entirely at the risk of the Shipper. The Carrier shall not be liable...',
  },
  {
    title: 'GOVERNING LAW AND JURISDICTION',
    description:
      '(A) Any claims arising from or in connection with or relating to this Bill of Lading shall...',
  },
  {
    title: 'GENERAL AVERAGE',
    description:
      'General Average shall be adjusted according to the York-Antwerp Rules as applicable to the voyage...',
  },
])

const weightUnitOptions = [
  { label: 'KGM', value: 'KGM' },
  { label: 'LBR', value: 'LBR' },
]

const volumeUnitOptions = [
  { label: 'MTQ', value: 'MTQ' },
  { label: 'FTQ', value: 'FTQ' },
]

const sizeTypeOptions = [
  { label: '40HC', value: '40HC' },
  { label: '20DC', value: '20DC' },
  { label: '40GP', value: '40GP' },
  { label: '20GP', value: '20GP' },
]

const pkgUnitOptions = weightUnitOptions

const scOptions = [
  { label: 'S', value: 'S' },
  { label: 'C', value: 'C' },
]

const rfOptions = [
  { label: 'Y', value: 'Y' },
  { label: 'N', value: 'N' },
]

const tempUnitOptions = [
  { label: 'C', value: 'C' },
  { label: 'F', value: 'F' },
]

const createContainerItem = (id, overrides = {}) => ({
  id,
  containerNo: '',
  sealNo: '',
  sizeType: sizeTypeOptions[0]?.value || '',
  pkgQty: '',
  pkgUnit: pkgUnitOptions[0]?.value || '',
  grossWeight: '',
  grossWeightUnit: weightUnitOptions[0]?.value || '',
  tare: '',
  tareUnit: weightUnitOptions[0]?.value || '',
  vgm: '',
  volume: '',
  volumeUnit: volumeUnitOptions[0]?.value || '',
  sc: scOptions[0]?.value || '',
  rf: rfOptions[1]?.value || '',
  temp: '',
  tempUnit: tempUnitOptions[0]?.value || '',
  dgName: '',
  imdg: '',
  ...overrides,
})

const containerList = ref(
  Array.from({ length: 18 }, (_, index) => {
    const prefix = ['HMMU', 'COSCO', 'MAEU', 'OOCL', 'EVERGREEN'][index % 5]
    const sizeType = sizeTypeOptions[index % sizeTypeOptions.length].value
    const pkgUnit = pkgUnitOptions[index % pkgUnitOptions.length].value
    const grossWeight = (20000 + index * 113).toString()
    const tare = (3500 + index * 29).toString()
    const volume = (40 + index * 0.75).toFixed(3)

    return createContainerItem(index + 1, {
      containerNo: `${prefix}${String(6431100 + index).padStart(7, '0')}`,
      sealNo: String(2403500000 + index * 37),
      sizeType,
      pkgQty: String(21000 + index * 11),
      pkgUnit,
      grossWeight,
      tare,
      vgm: (25000 + index * 97).toString(),
      volume,
      sc: index % 2 === 0 ? 'S' : 'C',
      rf: index % 3 === 0 ? 'Y' : 'N',
      temp: index % 4 === 0 ? '5' : '',
      tempUnit: index % 4 === 0 ? 'C' : '',
      dgName: index % 6 === 0 ? 'CHEMICAL PRODUCT' : '',
      imdg: index % 6 === 0 ? '3082' : '',
    })
  }),
)

const isToOrderOptions = [
  { label: 'Y', value: 'Y' },
  { label: 'N', value: 'N' },
]

const endorsementTypeOptions = [
  { label: 'BLANK', value: 'BLANK' },
  { label: 'ENDORSE', value: 'ENDORSE' },
  { label: 'BLANK ENDORSE', value: 'BLANK_ENDORSE' },
  { label: 'ENDORSE TO ORDER', value: 'ENDORSE_TO_ORDER' },
]
</script>
